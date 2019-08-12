import { getNewId, newDate, writeJSONFile } from '../helpers/helpers';
import { Constants } from '../helpers/constants';

// eslint-disable-next-line import/no-dynamic-require
const filenameTrips = '../data/trips.json';
// eslint-disable-next-line import/no-dynamic-require
const filenameUsers = '../data/users.json';
// eslint-disable-next-line import/no-dynamic-require
const filenameBookings = '../data/bookings.json';

// eslint-disable-next-line import/no-dynamic-require
const bookings = require(filenameBookings);
// eslint-disable-next-line import/no-dynamic-require
const users = require(filenameUsers);
// eslint-disable-next-line import/no-dynamic-require
const trips = require(filenameTrips);

class BookingsService {
  // eslint-disable-next-line camelcase
  create({ trip_id, user_id, seat_no }) {

    const currentTrip = trips.filter(t => t.id === trip_id)[0];

    if (currentTrip) {

      const isTripActive = currentTrip.status === 1;

      if (isTripActive) {

        const currentTripSeatingCapacity = currentTrip.seating_capacity;
        const bookedSeatsOnCurrentTrip = bookings.filter(b => b.trip_id === trip_id).length;
        const isAnySeatAvailable = currentTripSeatingCapacity > bookedSeatsOnCurrentTrip;

        if (isAnySeatAvailable) {

          const bookingAlreadyExists = bookings.filter(b => b.trip_id === trip_id && b.seat_no === seat_no && b.user_id === user_id)[0];

          if (!bookingAlreadyExists) {

            const isDesiredSeatAvailable = !bookings.filter(b => b.trip_id === trip_id && b.seat_no === seat_no).length;

            if (isDesiredSeatAvailable) {

              // eslint-disable-next-line camelcase
              // L.info(`create booking with [trip_id, user_id]: [${trip_id}, ${user_id} ]`);
              const newId = getNewId(bookings);
              const booking = {
                ...{
                  id: newId,
                  created_on: newDate(),
                  trip_id,
                  user_id,
                  seat_no
                },
              };

              const { id, ...noIdBooking } = booking;
              const noIdBookings = bookings.map(b => {
                // eslint-disable-next-line no-shadow
                const { id, ..._b } = b;
                return _b;
              });

              if (!JSON.stringify(noIdBookings)
                .includes(JSON.stringify(noIdBooking))) {
                bookings.push(booking);
                // eslint-disable-next-line no-return-assign, no-param-reassign
                bookings.forEach((el, i) => el.id = i + 1);

                // eslint-disable-next-line no-bitwise
                if (~bookings.indexOf(booking)) {
                  writeJSONFile(filenameBookings, bookings);

                  // eslint-disable-next-line camelcase
                  const bookingUser = users.filter(u => u.id === user_id)[0];
                  // eslint-disable-next-line camelcase
                  const bookingTrip = trips.filter(t => t.id === trip_id)[0];

                  const booking$ = {
                    booking_id: booking.id,
                    bus_license_number: bookingTrip.bus_license_number,
                    trip_date: bookingTrip.trip_date,
                    first_name: bookingUser.first_name,
                    last_name: bookingUser.last_name,
                    user_email: bookingUser.email,
                  };

                  return Promise.resolve({
                    code: Constants.response.created, // 201
                    response: {
                      status: Constants.response.created, // 201
                      message: 'Booking successfully created',
                      data: booking$,
                    },
                  });
                }
              }
            }
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({
              code: Constants.response.badRequest, // 400
              response: {
                status: Constants.response.badRequest, // 400
                error: 'Seat number not available on current trip!',
              },
            });
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            code: Constants.response.exists, // 409
            response: {
              status: Constants.response.exists, // 409
              error: 'Booking already exists!',
            },
          });
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          code: Constants.response.badRequest, // 400
          response: {
            status: Constants.response.badRequest, // 400
            error: 'Current trip is full!',
          },
        });
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        code: Constants.response.badRequest, // 400
        response: {
          status: Constants.response.badRequest, // 400
          error: 'You can not book a cancelled trip!',
        },
      });
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.notFound, // 400
      response: {
        status: Constants.response.notFound, // 400
        error: 'Trip not found!',
      },
    });
  }

  all(email) {
    // L.info(bookings, 'fetch all bookings');

    const loggedUser = users.filter(u => u.email === email)[0];

    const bookings$ = [];

    // eslint-disable-next-line max-len
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
          data: bookings$,
        },
      });
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: 'No booking found!',
      },
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
            data: 'Booking deleted successfully!',
          },
        });
      }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.notFound, // 404,
      response: {
        status: Constants.response.notFound, // 404,
        error: `No booking was found with id: ${bookingId}`,
      },
    });
  }
}

export default new BookingsService();
