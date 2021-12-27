module.exports = class ServerError extends Error {
  constructor(paramName) {
    super("Erro interno no servidor");
    this.name = "serverError";
  }
};
