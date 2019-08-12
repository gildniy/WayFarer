import TripsService from '../../services/trips.service';

const tripList = (req) => {
  const parsedQs = req.query;
  const queryOrigin = parsedQs.origin;
  const queryDestination = parsedQs.destination;

  return typeof queryOrigin === 'string' ?
    TripsService.byOrigin(queryOrigin) : (
      typeof queryDestination === 'string' ?
        TripsService.byOrigin(queryOrigin) :
        TripsService.all()
    );
};

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
    tripList(req)
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
        .send(e.response));
  }
}

export default new Controller();
