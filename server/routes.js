import usersRouter from './api/controllers/users/router';

export default function routes(app) {
  app.use('/api/v1/auth', usersRouter);
}
