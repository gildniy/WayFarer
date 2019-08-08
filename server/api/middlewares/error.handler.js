// eslint-disable-next-line no-unused-vars, no-shadow
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500)
    .json({
      status: 'error',
      error: err.message
    });
};
export default errorHandler;
