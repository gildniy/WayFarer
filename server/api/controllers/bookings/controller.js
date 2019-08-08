import BookingsService from '../../services/bookings.service';
import * as jwt from 'jsonwebtoken';

class Controller {
  bookTrip(req, res) {
    const bookingObj = req.body;
    BookingsService.create(bookingObj)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  showBookings(req, res) {
    const authHeaders = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeaders.split(' ')[1];
    const decoded = jwt.decode(token);
    const email = decoded.email;
    BookingsService.all(email)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }
}

export default new Controller();
