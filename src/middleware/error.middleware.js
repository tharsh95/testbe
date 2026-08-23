export const errorHandler = (err, req, res, next) => {
  // If headers have already been sent, delegate to Express's default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Log the error for debugging (in a real app, use a logger)
  console.error(err);

  // Default to 500 if no status is set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // If the error is already a formatted error object (from our validators or services), use it
  if (err.error && err.error.message) {
    return res.status(statusCode).json(err.error);
  }

  // Otherwise, format the error
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      // In production, we might not want to leak details
      ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
    },
  });
};