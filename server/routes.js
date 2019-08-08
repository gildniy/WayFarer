import usersRouter from './api/controllers/users/router';
import tripsRouter from './api/controllers/trips/router';
import bookingsRouter from './api/controllers/bookings/router';

export default function routes(app) {
  app.use('/api/v1/auth', usersRouter);
  app.use('/api/v1/trips', tripsRouter);
  app.use('/api/v1/bookings', bookingsRouter);
}
