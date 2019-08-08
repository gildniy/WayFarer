import L from '../../common/logger';
import { getNewId, newDate, writeJSONFile } from '../helpers/helpers';
import { Constants } from '../helpers/constants';

const filenameTrips = '../data/trips.json';
const filenameUsers = '../data/users.json';
const filenameBookings = '../data/bookings.json';

const bookings = require(filenameBookings);
const users = require(filenameUsers);
const trips = require(filenameTrips);

class BookingsService {

  create({ trip_id, user_id }) {
    L.info(`create booking with [trip_id, user_id]: [${trip_id}, ${user_id} ]`);

    const newId = getNewId(bookings);
    const booking = {
      ...{
        id: newId,
        created_on: newDate(),
        trip_id,
        user_id
      }
    };

    const { id, ...noIdBooking } = booking;
    const noIdBookings = bookings.map(b => {
      const { id, ..._b } = b;
      return _b;
    });

    if (!JSON.stringify(noIdBookings)
      .includes(JSON.stringify(noIdBooking))) {

      bookings.push(booking);
      bookings.forEach((el, i) => el.id = i + 1);

      if (~bookings.indexOf(booking)) {
        writeJSONFile(filenameBookings, bookings);

        const bookingUser = users.filter(u => u.id === user_id)[0];
        const bookingTrip = trips.filter(t => t.id === trip_id)[0];

        const booking$ = {
          booking_id: booking.id,
          bus_license_number: bookingTrip.bus_license_number,
          trip_date: bookingTrip.trip_date,
          first_name: bookingUser.first_name,
          last_name: bookingUser.last_name,
          user_email: bookingUser.email
        };

        return Promise.resolve({
          code: Constants.response.created, // 201
          response: {
            status: 'success',
            data: booking$
          }
        });
      }
      return Promise.reject({
        code: Constants.response.serverError, // 500
        response: {
          status: 'error',
          error: 'Internal server error!'
        }
      });
    }
    return Promise.reject({
      code: Constants.response.exists, // 409
      response: {
        status: 'error',
        error: 'Booking already exists!'
      }
    });
  }

  all(email) {
    L.info(bookings, 'fetch all bookings');

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
          status: 'success',
          data: bookings$
        }
      });
    }
    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: 'error',
        data: 'No booking found!'
      }
    });
  }
}

export default new BookingsService();
