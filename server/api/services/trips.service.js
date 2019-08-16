import { Constants } from '../helpers/constants';
import L from '../../common/logger';

const qr = require('../db-query');
const Pool = require('pg').Pool;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

class TripsService {
  create({ tripObj, is_admin }) {

    return new Promise((resolve, reject) => {

      // L.info('THIS IS IT', tripObj);

      if(is_admin){
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
          AND trip_date = $5 
          AND fare = $6`,
          [
            trip.seating_capacity,
            trip.bus_license_number,
            trip.origin,
            trip.destination,
            trip.trip_date,
            trip.fare,
          ], (error, results) => {

            const existingTrip = results.rows && results.rows[0];

            if (!existingTrip) {

              const text = `INSERT
                INTO trips(seating_capacity, bus_license_number, origin, destination, trip_date, fare, status)
                VALUES($1, $2, $3, $4, $5, $6, $6)
                returning *`;

              const values = [
                trip.seating_capacity,
                trip.bus_license_number,
                trip.origin,
                trip.destination,
                trip.trip_date,
                trip.fare,
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
      }else {
        reject({
          code: Constants.response.forbidden, // 403
          response: {
            status: Constants.response.forbidden, // 403
            error: 'Only admins can create a trip!',
          },
        });
      }
    });
  }

  edit({tripId, is_admin}) {

    return new Promise((resolve, reject) => {

      if(is_admin){

        pool.query(`SELECT * FROM trips WHERE id = $1`, [tripId], (error, results) => {
          const tripToCancel = results.rows && results.rows[0];

          if (tripToCancel) {
            if (tripToCancel.status) {
              const text = `UPDATE trips SET status = ($1) WHERE id = ($2)`;
              qr.query(text, [0, tripId])
                .then(r => {
                  resolve({
                    code: Constants.response.ok, // (204) 200 instead
                    response: {
                      status: Constants.response.ok, // (204) 200 instead
                      message: 'success',
                      data: 'Trip cancelled successfully'
                    }
                  });
                })
                .catch(e => {
                  reject({
                    code: Constants.response.serverError, // 500
                    response: {
                      status: Constants.response.serverError, // 500
                      error: `Internal server error`
                    }
                  });
                });
            } else {
              reject({
                code: Constants.response.badRequest, // 400
                response: {
                  status: Constants.response.badRequest, // 400
                  error: 'Trip already cancelled'
                }
              });
            }
          } else {
            reject({
              code: Constants.response.notFound, // 404
              response: {
                status: Constants.response.notFound, // 404
                error: `No trip found with the supplied id`
              }
            });
          }
        });
      }else {
        reject({
        code: Constants.response.forbidden, // 403
        response: {
          status: Constants.response.forbidden, // 403
          error: `Only admins can cancel a trip!`
        }
      });

      }
    });
  }

  all() {

    return new Promise((resolve, reject) => {

      pool.query(`SELECT * FROM trips WHERE status = $1`, [1], (error, results) => {

        // L.info(`TEST COMES HERE!`, results.rows);

        const availableTrips = results.rows;

        if (availableTrips.length) {

          const trips$ = [];

          for (const t of availableTrips) {
            const trip$ = {
              trip_id: t.id,
              seating_capacity: t.seating_capacity,
              origin: t.origin,
              destination: t.destination,
              trip_date: t.trip_date,
              fare: t.fare
            };
            trips$.push(trip$);
          }
          resolve({
            code: Constants.response.ok, // 200
            response: {
              status: Constants.response.ok, // 200
              message: 'Retrieved successfully',
              data: trips$
            }
          });
        } else {
          reject({
            code: Constants.response.notFound, // 404
            response: {
              status: Constants.response.notFound, // 404
              error: 'No trip found!'
            }
          });
        }
      });
    });
  }

  byId(tripId) {
    L.info(`fetch trip with id ${tripId}`);

    return new Promise((resolve, reject) => {

        pool.query(`SELECT * FROM trips WHERE id = $1`, [tripId], (error, results) => {

            const trip = results.rows && results.rows[0];

            if (trip) {
              if (trip.status) {
                resolve({
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
              } else {
                reject({
                  code: Constants.response.badRequest, // 400
                  response: {
                    status: Constants.response.badRequest, // 400
                    error: 'Trip was canceled'
                  }
                });
              }
            } else {
              reject({
                code: Constants.response.notFound, // 404
                response: {
                  status: Constants.response.notFound, // 404
                  error: `No trip found with id: ${tripId}`
                }
              });
            }
          }
        );
      }
    );
  }
}

export default new TripsService();
