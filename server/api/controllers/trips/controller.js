import TripsService from '../../services/trips.service';
import { decodedToken } from '../../helpers/helpers';

class Controller {
  createTrip(req, res) {
    const tripObj = req.body;
    const { is_admin } = decodedToken(req);
    TripsService.create({
      tripObj,
      is_admin
    })
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  cancelTrip(req, res) {
    const tripId = req.params['tripId'] * 1;
    const { is_admin } = decodedToken(req);
    TripsService.edit({
      tripId,
      is_admin
    })
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  showTrips(req, res) {
    TripsService.all()
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }

  showTrip(req, res) {
    const tripId = req.params.tripId * 1;
    TripsService.byId(tripId)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response)
      );
  }
}

export default new Controller();
