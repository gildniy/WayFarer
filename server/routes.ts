import { Application } from 'express';
import usersRouter     from './api/controllers/users/router';
import tripsRouter     from './api/controllers/trips/router';
import bookingsRouter  from './api/controllers/bookings/router';
import examplesRouter  from './api/controllers/examples/router';

// https://expressjs.com/en/guide/routing.html
// Since the hyphen (-) and the dot (.) are interpreted literally,
// they can be used along with route parameters for useful purposes.
export default function routes(app: Application): void {
    app.use('/api/v1/auth', usersRouter)
       .use('/api/v1/trips', tripsRouter)
       .use('/api/v1/bookings', bookingsRouter)
       .use('/api/v1/examples', examplesRouter);
};
