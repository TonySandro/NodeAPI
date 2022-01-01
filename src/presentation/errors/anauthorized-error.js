module.exports = class AnauthorizedError extends Error {
  constructor(paramName) {
    super(`Anauthorized`);
    this.name = "AnauthorizedError";
  }
};
