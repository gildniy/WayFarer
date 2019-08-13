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

  cancelTrip(req, res) {
    const id = req.params.tripId * 1;
    TripsService.edit(id)
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
