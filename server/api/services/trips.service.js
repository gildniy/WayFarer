import { Constants } from '../helpers/constants';
import L from '../../common/logger';
import { responseObj } from '../helpers/helpers';

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
                VALUES($1, $2, $3, $4, $5, $6, $7)
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

              const data = {
                trip_id: trip.id,
                seating_capacity: trip.seating_capacity,
                origin: trip.origin,
                destination: trip.destination,
                trip_date: trip.trip_date,
                fare: trip.fare,
              };

              qr.query(text, values)
                .then(r => resolve(responseObj('success', Constants.response.ok, 'Successfully created', data)))
                .catch(e => reject(responseObj('error', Constants.response.serverError, 'Internal server error!')));
            } else {
              reject(responseObj('error', Constants.response.exists, 'Trip already exist!'));
            }
          });
      } else {
        reject(responseObj('error', Constants.response.forbidden, 'Only admins can create a trip!'));
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
                .then(r => resolve(responseObj('success', Constants.response.ok, 'success', 'Trip cancelled successfully')))
                .catch(e => reject(responseObj('error', Constants.response.serverError, 'Internal server error')));
            } else {
              reject(responseObj('error', Constants.response.badRequest, 'Trip already cancelled'));
            }
          } else {
            reject(responseObj('error', Constants.response.forbidden, 'No trip found with the supplied id'));
          }
        });
      }else {
        reject(responseObj('error', Constants.response.forbidden, 'Only admins can cancel a trip!'));
      }
    });
  }

  all(req) {

    L.info(`REQ QUERY!`, req.query);

    return new Promise((resolve, reject) => {

      pool.query(`SELECT * FROM trips WHERE status = $1`, [1], (error, results) => {

        L.info(`TEST COMES HERE!`, results.rows);

        const allActiveTrips = results && results.rows;

        if (allActiveTrips && allActiveTrips.length) {

          const response = [];

          if (Object.keys(req.query).length !== 0) {
            const origin = req.query.origin;
            const destination = req.query.destination;

            // Display filtered trips
            Object.keys(req.query).length === 1 &&
            typeof origin !== 'undefined' &&
            response.push(...allActiveTrips.filter(trip => trip.origin === origin));

            Object.keys(req.query).length === 1 &&
            typeof destination !== 'undefined' &&
            response.push(...allActiveTrips.filter(trip => trip.destination === destination));

            // If we have more than 1 query options or the option differ from "origin" or "destination"
            if (
              Object.keys(req.query).length === 1 &&
              typeof origin === 'undefined' &&
              typeof destination === 'undefined' ||
              Object.keys(req.query).length > 1
            ) {
              resolve(
                responseObj(
                  'error',
                  Constants.response.unprocessableEntry,
                  'Allowed to either filter by origin or by destination'
                )
              );
              return;
            }
          } else { // Display all trips if no filter is applied
            response.push(...allActiveTrips);
          }

          if (response.length) {

            const trips$ = [];

            for (const t of response) {
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
            resolve(responseObj('success', Constants.response.ok, 'Retrieved successfully', trips$));
          } else {
            reject(responseObj('error', Constants.response.notFound, 'No trip found!'));
          }
        }
      }, [1]);
    });
  }

  byId(tripId) {
    L.info(`fetch trip with id ${tripId}`);

    return new Promise((resolve, reject) => {

        pool.query(`SELECT * FROM trips WHERE id = $1`, [tripId], (error, results) => {

            const trip = results.rows && results.rows[0];
            const data = {
              trip_id: trip.id,
              seating_capacity: trip.seating_capacity,
              origin: trip.origin,
              destination: trip.destination,
              trip_date: trip.trip_date,
              fare: trip.fare
            };

            if (trip) {
              if (trip.status) {
                resolve(responseObj('success', Constants.response.ok, 'Retrieved successfully', data));
              } else {
                reject(responseObj('error', Constants.response.badRequest, 'Trip was canceled'));
              }
            } else {
              reject(responseObj('error', Constants.response.notFound, `No trip found with id: ${tripId}`))
            }
          }
        );
      }
    );
  }
}

export default new TripsService();
