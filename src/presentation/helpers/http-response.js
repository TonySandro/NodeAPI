const AnauthorizedError = require("./anauthorized-error");
const ServerError = require("./server-error");

module.exports = class HttpResponse {
  static badRequest(error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    };
  }

  static anauthorizedError() {
    return {
      statusCode: 401,
      body: new AnauthorizedError(),
    };
  }

  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    };
  }
};
