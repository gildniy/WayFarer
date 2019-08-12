// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500)
    .send({
      status: err.status || 500,
      error: err.message,
    });
};
export default errorHandler;
