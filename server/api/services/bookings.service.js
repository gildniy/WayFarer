import L from '../../common/logger';
import { Constants } from '../helpers/constants';

const qr = require('../db-query');
const Pool = require('pg').Pool;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

class BookingsService {

  create({ trip_id, user_id, is_admin, seat_number }) {

    return new Promise((resolve, reject) => {

      if (!is_admin) {

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
      } else {
        reject({
          code: Constants.response.forbidden, // 403
          response: {
            status: Constants.response.forbidden, // 403
            error: 'Admin cannot book a seat!',
          },
        });
      }
    });
  }

  all({ user_id, is_admin }) {

    return new Promise((resolve, reject) => {

      let text;
      let query$;

      if (is_admin) {
        text = `SELECT * FROM bookings`;
        query$ = qr.query(text);
      } else {
        text = `SELECT * FROM bookings WHERE user_id = ($1)`;
        query$ = qr.query(text, [user_id]);
      }

      query$.then(bookingList => {

        if (bookingList.length) {

          pool.query(`SELECT * FROM trips`, (errTrips, resTrips) => {
            pool.query(`SELECT * FROM users`, (errUsers, resUsers) => {
              if (errTrips || errUsers) {
                reject({
                  code: Constants.response.serverError, // 500
                  response: {
                    status: Constants.response.serverError, // 500
                    error: 'Internal server error!',
                  },
                });
              } else {

                const bookings$ = [];

                bookingList.forEach(b => {

                  const bookingTrip = resTrips.rows.filter(t => t.id === b.trip_id)[0];
                  const bookingUser = resUsers.rows.filter(u => u.id === b.user_id)[0];
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
                resolve({
                  code: Constants.response.ok, // 200
                  response: {
                    status: Constants.response.ok, // 200
                    message: 'Retrieved successfully',
                    data: bookings$
                  }
                });
              }
            });
          });
        } else {
          reject({
            code: Constants.response.notFound, // 404
            response: {
              status: Constants.response.notFound, // 404
              error: 'No booking found!'
            }
          });
        }
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
    });
  }

  delete({ id, user_id, is_admin }) {

    return new Promise((resolve, reject) => {

      if (!is_admin) {

        const text = `SELECT * FROM bookings WHERE id = ($1)`;

        qr.query(text, [id])
          .then(r => {

            const bookingToDelete = r[0];

            if (bookingToDelete) {

              L.info(`TEST COMES HERE!`, bookingToDelete);

              if (bookingToDelete.user_id === user_id) {
                pool.query(`DELETE FROM bookings WHERE id = $1`, [id], (err, res) => {
                  if (!err) {
                    resolve({
                      code: Constants.response.deletedOrModified, // 200
                      response: {
                        status: Constants.response.deletedOrModified, // 200
                        message: 'success',
                        data: 'Booking deleted successfully!'
                      }
                    });
                  } else {
                    reject({
                      code: Constants.response.serverError, // 500
                      response: {
                        status: Constants.response.serverError, // 500
                        error: 'Internal server error!'
                      }
                    });
                  }
                });
              } else {
                reject({
                  code: Constants.response.forbidden, // 403
                  response: {
                    status: Constants.response.forbidden, // 403
                    error: `You cannot delete others booking!`
                  }
                });
              }
            } else {
              reject({
                code: Constants.response.notFound, // 404,
                response: {
                  status: Constants.response.notFound, // 404,
                  error: `No booking was found with id: ${id}`
                }
              });
            }
          })
          .catch(e => {
            reject({
              code: Constants.response.serverError, // 500
              response: {
                status: Constants.response.serverError, // 500
                error: 'Internal server error!'
              }
            });
          });
      } else {
        reject({
          code: Constants.response.forbidden, // 403
          response: {
            status: Constants.response.forbidden, // 403
            error: `Admin cannot delete a booking!`
          }
        });
      }
    });
  }
}

export default new BookingsService();
