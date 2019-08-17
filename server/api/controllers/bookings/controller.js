import BookingsService from '../../services/bookings.service';
import { decodedToken } from '../../helpers/helpers';

class Controller {
  bookTrip(req, res) {
    const { trip_id, seat_number } = req.body;
    const { user_id, is_admin } = decodedToken(req);
    BookingsService.create({
      trip_id,
      user_id,
      is_admin,
      seat_number
    })
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  showBookings(req, res) {
    const { user_id, is_admin } = decodedToken(req);
    BookingsService.all({
      user_id,
      is_admin
    })
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  deleteBooking(req, res) {
    const id = req.params.bookingId * 1;
    const { user_id, is_admin } = decodedToken(req);
    BookingsService.delete({
      id,
      user_id,
      is_admin
    })
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }
}

export default new Controller();
