import { getNewId, writeJSONFile } from '../helpers/helpers';
import { Constants } from '../helpers/constants';
import L from '../../common/logger';

const filename = '../data/trips.json';
// eslint-disable-next-line import/no-dynamic-require
const trips = require(filename);

class TripsService {
  create(tripObj) {
    L.info(`create trip with trip_date: ${tripObj.trip_date}`);

    const trip = {
      ...{
        id: getNewId(trips),
        status: 1,
      },
      ...tripObj,
    };
    const { id, ...noIdTrip } = trip;
    const noIdTrips = trips.map(t => {
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
            status: 'success',
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

      return Promise.reject({
        code: Constants.response.serverError, // 500
        response: {
          status: 'error',
          error: 'Internal server error!',
        },
      });
    }

    return Promise.reject({
      code: Constants.response.exists, // 409
      response: {
        status: 'error',
        error: 'Trip already exist!',
      },
    });
  }
}

export default new TripsService();
