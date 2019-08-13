import { writeJSONFile } from '../helpers/helpers';
import { Constants } from '../helpers/constants';
import L from '../../common/logger';

const qr = require('../db-query');
const Pool = require('pg').Pool;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

class TripsService {
  create(tripObj) {

    return new Promise((resolve, reject) => {

      const trip = {
        ...tripObj,
        ...{ status: 1 },
      };

      pool.query(`SELECT * 
          FROM trips 
          WHERE seating_capacity = $1 
          AND bus_license_number = $2 
          AND origin = $3 
          AND destination = $4 
          AND trip_date = $5`,
        [
          trip.seating_capacity,
          trip.bus_license_number,
          trip.origin,
          trip.destination,
          trip.trip_date,
        ], (error, results) => {

          const existingTrip = results.rows && results.rows[0];

          if (!existingTrip) {

            const text = `INSERT
                INTO trips(seating_capacity, bus_license_number, origin, destination, trip_date, status)
                VALUES($1, $2, $3, $4, $5, $6)
                returning *`;

            const values = [
              trip.seating_capacity,
              trip.bus_license_number,
              trip.origin,
              trip.destination,
              trip.trip_date,
              trip.status,
            ];

            qr.query(text, values)
              .then(r => {
                resolve({
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
              })
              .catch(e => {
                reject({
                  code: Constants.response.serverError, // 500
                  response: {
                    status: Constants.response.serverError, // 500
                    error: 'Internal server error!',
                  },
                });
              });
          } else {
            reject({
              code: Constants.response.exists, // 409
              response: {
                status: Constants.response.exists, // 409
                error: 'Trip already exist!',
              },
            });
          }
        });
    });
  }

  edit(tripId) {
    L.info(`edit trip with Id ${ tripId }`);

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
              data: 'Trip cancelled successfully'
            }
          });
        } else {
          return Promise.resolve({
            code: Constants.response.notFound, // 404
            response: {
              status: Constants.response.notFound, // 404
              error: 'Trip already canceled'
            }
          });
        }
      } else {

        return Promise.reject({
          code: Constants.response.serverError, // 500
          response: {
            status: Constants.response.serverError, // 500
            error: `Internal server error`
          }
        });
      }
    }

    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: `No trip found with id: ${ tripId }`
      }
    });
  }

  all() {
    L.info(trips, 'fetch all trips');

    if (trips.length) {

      const trips$ = [];

      trips.forEach(t => {

        const trip$ = {
          trip_id: t.id,
          seating_capacity: t.seating_capacity,
          origin: t.origin,
          destination: t.destination,
          trip_date: t.trip_date,
          fare: t.fare
        };

        trips$.push(trip$);
      });

      return Promise.resolve({
        code: Constants.response.ok, // 200
        response: {
          status: Constants.response.ok, // 200
          message: 'Retrieved successfully',
          data: trips$
        }
      });
    }

    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: 'No trip found!'
      }
    });
  }

  byId(tripId) {
    L.info(`fetch trip with id ${tripId}`);

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
            fare: trip.fare
          }
        }
      });
    }

    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: `No trip found with id: ${tripId}`
      }
    });
  }
}

export default new TripsService();
