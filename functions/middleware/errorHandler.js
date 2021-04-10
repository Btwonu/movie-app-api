module.exports = (err, req, res, next) => {
  const error = {
    message: err.message || 'Something went wrong.',
    status: err.status || 500,
  };

  res.status(error.status).json(error);
};
