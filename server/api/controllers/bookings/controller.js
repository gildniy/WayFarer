import * as jwt from 'jsonwebtoken';
import BookingsService from '../../services/bookings.service';

const decodedToken = req => {
  const authHeaders = req.headers.authorization || req.headers.Authorization;
  const token = authHeaders.split(' ')[1];
  return jwt.decode(token);
};

class Controller {
  bookTrip(req, res) {
    // eslint-disable-next-line camelcase
    const { trip_id } = req.body;
    // eslint-disable-next-line camelcase
    const { user_id } = decodedToken(req);
    BookingsService.create({
      trip_id,
      user_id,
      seat_no
    })
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  showBookings(req, res) {
    const { email } = decodedToken(req);
    BookingsService.all(email)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  deleteBooking(req, res) {
    const id = req.params.bookingId * 1;
    BookingsService.delete(id)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }
}

export default new Controller();
