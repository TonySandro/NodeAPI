const LoginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");

/* 
Designer pattern Factory. 
Para evitar que quando mude a instancia de um objeto, 
afete todos os lugares que usavam o mesmo.
*/
const makeSut = () => {
  return new LoginRouter();
};

describe("Login Router", () => {
  test("Should return 400 if no email is provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        password: "anyPassword",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 500 if no hettpRequest is provided", () => {
    const sut = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if hettpRequest has no body", () => {
    const sut = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  // test("Should call AuthUseCase with correct params", () => {
  //   const sut = makeSut();
  //   const httpRequest = {};
  //   const httpResponse = sut.route(httpRequest);
  //   expect(httpResponse.statusCode).toBe(500);
  // });
});
