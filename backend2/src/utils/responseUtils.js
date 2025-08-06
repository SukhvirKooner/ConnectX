/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @returns {Object} - Formatted response
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} errors - Detailed errors
 * @returns {Object} - Formatted error response
 */
const errorResponse = (res, statusCode = 400, message = 'Error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {String} message - Not found message
 * @returns {Object} - Not found response
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, 404, message);
};

/**
 * Unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Unauthorized message
 * @returns {Object} - Unauthorized response
 */
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return errorResponse(res, 401, message);
};

/**
 * Forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Forbidden message
 * @returns {Object} - Forbidden response
 */
const forbiddenResponse = (res, message = 'Forbidden access') => {
  return errorResponse(res, 403, message);
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors
 * @returns {Object} - Validation error response
 */
const validationErrorResponse = (res, errors) => {
  return errorResponse(res, 400, 'Validation failed', errors);
};

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse
};