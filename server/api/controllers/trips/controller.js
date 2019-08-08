import TripsService from '../../services/trips.service';

class Controller {
  createTrip(req, res) {
    const tripObj = req.body;
    TripsService.create(tripObj)
      .then(r => res.status(r.code)
        .send(r.response))
      .catch(e => res.status(e.code)
        .send(e.response));
  }
}

export default new Controller();
