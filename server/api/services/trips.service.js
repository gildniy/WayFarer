import { getNewId, writeJSONFile } from '../helpers/helpers';
import { Constants } from '../helpers/constants';
// import L from '../../common/logger';

const filename = '../data/trips.json';
// eslint-disable-next-line import/no-dynamic-require
const trips = require(filename);

const tripsListing = (tripsList) => {

  const activeTripsList = tripsList.filter(t => t.status === 1);

  if (activeTripsList.length) {

    const trips$ = [];

    activeTripsList.forEach(t => {
      const trip$ = {
        trip_id: t.id,
        seating_capacity: t.seating_capacity,
        origin: t.origin,
        destination: t.destination,
        trip_date: t.trip_date,
        fare: t.fare,
      };

      trips$.push(trip$);
    });

    return Promise.resolve({
      code: Constants.response.ok, // 200
      response: {
        status: Constants.response.ok, // 200
        message: 'Retrieved successfully',
        data: trips$,
      },
    });
  }
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    code: Constants.response.notFound, // 404
    response: {
      status: Constants.response.notFound, // 404
      error: 'No trip found!',
    },
  });
};

class TripsService {
  create(tripObj) {
    // L.info(`create trip with trip_date: ${tripObj.trip_date}`);

    const trip = {
      ...{
        id: getNewId(trips),
        status: 1,
      },
      ...tripObj,
    };
    const { id, ...noIdTrip } = trip;
    const noIdTrips = trips.map(t => {
      // eslint-disable-next-line no-shadow
      const { id, ..._t } = t;
      return _t;
    });

    if (!JSON.stringify(noIdTrips)
      .includes(JSON.stringify(noIdTrip))) {
      trips.push(trip);

      if (trips.includes(trip)) {
        writeJSONFile(filename, trips);

        return Promise.resolve({
          code: Constants.response.ok, // 200
          response: {
            status: Constants.response.ok, // 200
            message: 'Successfully created',
            data: {
              trip_id: trip.id,
              seating_capacity: trip.seating_capacity,
              origin: trip.origin,
              destination: trip.destination,
              trip_date: trip.trip_date,
              fare: trip.fare,
            },
          },
        });
      }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.exists, // 409
      response: {
        status: Constants.response.exists, // 409
        error: 'Trip already exist!',
      },
    });
  }

  edit(tripId) {
    // L.info(`edit trip with Id ${tripId}`);

    const tripToCancel = trips.filter(t => t.id === tripId)[0];

    if (tripToCancel) {
      const tripStatusBeforeCancel = tripToCancel.status;
      tripToCancel.status = 0;
      const tripStatusAfterCancel = tripToCancel.status;

      if (tripStatusAfterCancel === 0) {
        if (tripStatusBeforeCancel !== tripStatusAfterCancel) {
          writeJSONFile(filename, trips);

          return Promise.resolve({
            code: Constants.response.ok, // (204) 200 instead
            response: {
              status: Constants.response.ok, // (204) 200 instead
              message: 'success',
              data: 'Trip cancelled successfully',
            },
          });
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          code: Constants.response.methodNotAllowed, // 405
          response: {
            status: Constants.response.methodNotAllowed, // 405
            error: 'Trip already canceled',
          },
        });
      }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: `No trip found with id: ${tripId}`,
      },
    });
  }

  all() {
    return tripsListing(trips);
  }

  byId(tripId) {
    // L.info(`fetch trip with id ${tripId}`);

    const trip = trips.filter(t => t.id === tripId)[0];

    if (trip) {
      return Promise.resolve({
        code: Constants.response.ok, // 200
        response: {
          status: Constants.response.ok, // 200
          message: 'Retrieved successfully',
          data: {
            trip_id: trip.id,
            seating_capacity: trip.seating_capacity,
            origin: trip.origin,
            destination: trip.destination,
            trip_date: trip.trip_date,
            fare: trip.fare,
          },
        },
      });
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: `No trip found with id: ${tripId}`,
      },
    });
  }

  byOrigin(origin) {
    const tripsByOrigin = trips.filter(t => t.origin === origin);
    return tripsListing(tripsByOrigin);
  }

  byDestination(destination) {
    const tripsByDestination = trips.filter(t => t.destination === destination);
    return tripsListing(tripsByDestination);
  }
}

export default new TripsService();
