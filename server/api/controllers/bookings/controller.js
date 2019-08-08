import BookingsService from '../../services/bookings.service';
import L from '../../../common/logger';

class Controller {
  bookTrip(req, res) {
    const bookingObj = req.body;
    BookingsService.create(bookingObj)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }
}

export default new Controller();
