import L from '../../common/logger';
import { writeJSONFile } from '../helpers/helpers';
import { Constants } from '../helpers/constants';

const filenameTrips = '../data/trips.json';
const filenameUsers = '../data/users.json';
const filenameBookings = '../data/bookings.json';

const bookings = require(filenameBookings);
const users = require(filenameUsers);
const trips = require(filenameTrips);

const qr = require('../db-query');
const Pool = require('pg').Pool;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

class BookingsService {

  create({ trip_id, user_id, seat_number }) {

    // L.info(`create booking with [trip_id, user_id]: [${trip_id}, ${user_id} ]`);

    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM trips WHERE id = $1`, [trip_id], (err, res) => {

        const currentTrip = res.rows && res.rows[0];

        if (currentTrip) {

          const isCurrentTripActive = currentTrip.status;

          if (isCurrentTripActive) {

            pool.query(`SELECT * FROM bookings WHERE trip_id = $1`, [trip_id], (err$, res$) => {

              const currentTripBookings = res$.rows;
              const bookedSeatsOnCurrentTrip = currentTripBookings && currentTripBookings.length;
              const currentTripSeatingCapacity = currentTrip.seating_capacity;
              const isAnySeatAvailable = currentTripSeatingCapacity > bookedSeatsOnCurrentTrip;

              if (isAnySeatAvailable) {

                const bookingAlreadyExists = !!currentTripBookings.find(b => b.trip_id === trip_id && b.user_id === user_id && b.seat_number === seat_number);

                if (!bookingAlreadyExists) {

                  const isDesiredSeatAvailable = !currentTripBookings.find(b => b.trip_id === trip_id && b.seat_number === seat_number);

                  // L.info(`THIS IS MY TEST!`, isDesiredSeatAvailable);

                  if (isDesiredSeatAvailable) {

                    const text = `INSERT INTO bookings(trip_id, user_id, seat_number) VALUES($1, $2, $3)`;
                    const values = [
                      trip_id,
                      user_id,
                      seat_number
                    ];

                    qr.query(text, values)
                      .then(r => {
                        pool.query(`SELECT * FROM users WHERE id = $1`, [user_id], (_err, _res) => {
                          const currentUser = _res.rows[0];
                          const booking$ = {
                            booking_id: r.id,
                            bus_license_number: currentTrip.bus_license_number,
                            trip_date: currentTrip.trip_date,
                            first_name: currentUser.first_name,
                            last_name: currentUser.last_name,
                            user_email: currentUser.email,
                          };
                          resolve({
                            code: Constants.response.created, // 201
                            response: {
                              status: Constants.response.created, // 201
                              message: 'Booking successfully created',
                              data: booking$,
                            },
                          });
                        });
                      })
                      .catch(e => {
                        reject({
                          code: Constants.response.serverError, // 500
                          response: {
                            status: Constants.response.serverError, // 500
                            error: 'Internal server error!',
                          },
                        });
                      });
                  } else {
                    reject({
                      code: Constants.response.badRequest, // 400
                      response: {
                        status: Constants.response.badRequest, // 400
                        error: 'Seat number booked by someone else!',
                      },
                    });
                  }
                } else {
                  reject({
                    code: Constants.response.exists, // 409
                    response: {
                      status: Constants.response.exists, // 409
                      error: 'You\'ve already made this booking before!',
                    },
                  });
                }
              } else {
                reject({
                  code: Constants.response.badRequest, // 400
                  response: {
                    status: Constants.response.badRequest, // 400
                    error: 'No seat available for current trip!',
                  },
                });
              }
            });
          } else {
            reject({
              code: Constants.response.badRequest, // 400
              response: {
                status: Constants.response.badRequest, // 400
                error: 'This trip was cancelled by the admin!',
              },
            });
          }
        } else {
          reject({
            code: Constants.response.notFound, // 400
            response: {
              status: Constants.response.notFound, // 400
              error: 'Trip not found!',
            },
          });
        }
      });
    });
  }

  all(email) {

    const loggedUser = users.filter(u => u.email === email)[0];

    const bookings$ = [];

    const bookingList = loggedUser.is_admin ? bookings : bookings.filter(b => b.user_id === loggedUser.id);

    if (bookingList.length) {

      bookingList.forEach(b => {

        const bookingUser = users.filter(u => u.id === b.user_id)[0];
        const bookingTrip = trips.filter(t => t.id === b.trip_id)[0];

        const booking$ = {
          booking_id: b.id,
          bus_license_number: bookingTrip.bus_license_number,
          trip_date: bookingTrip.trip_date,
          first_name: bookingUser.first_name,
          last_name: bookingUser.last_name,
          user_email: bookingUser.email,
        };

        bookings$.push(booking$);
      });

      return Promise.resolve({
        code: Constants.response.ok, // 200
        response: {
          status: Constants.response.ok, // 200
          message: 'Retrieved successfully',
          data: bookings$
        }
      });
    }
    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: 'No booking found!'
      }
    });
  }

  delete(bookingId) {
    // L.info(`delete bookings with id: ${bookingId}`);

    const bookingToDelete = bookings.filter(b => b.id === bookingId)[0];

    if (bookingToDelete) {

      const bookings$ = bookings.filter(b => b.id !== bookingId);

      if (JSON.stringify(bookings) !== JSON.stringify(bookings$)) {

        writeJSONFile(filenameBookings, bookings$);

        return Promise.resolve({
          code: Constants.response.deletedOrModified, // 200
          response: {
            status: Constants.response.deletedOrModified, // 200
            message: 'success',
            data: 'Booking deleted successfully!'
          }
        });
      }

      return Promise.reject({
        code: Constants.response.serverError, // 500
        response: {
          status: Constants.response.serverError, // 500
          error: 'Internal server error!'
        }
      });
    }
    return Promise.reject({
      code: Constants.response.notFound, // 404,
      response: {
        status: Constants.response.notFound, // 404,
        error: `No booking was found with id: ${bookingId}`
      }
    });
  }
}

export default new BookingsService();
