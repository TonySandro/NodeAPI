const MissingParamError = require("./missing-param-error");
const AnauthorizedError = require("./anauthorized-error");

module.exports = class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
    };
  }

  static anauthorizedError() {
    return {
      statusCode: 401,
      body: new AnauthorizedError(),
    };
  }
};
