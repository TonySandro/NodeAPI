const LoginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");
const AnauthorizedError = require("../helpers/anauthorized-error");

/* 
Designer pattern Factory. 
Para evitar que quando mude a instancia de um objeto, 
afete todos os lugares que usavam o mesmo.
*/
const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = "valid_token";
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    sut,
    authUseCaseSpy,
  };
};

describe("Login Router", () => {
  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 500 if no hettpRequest is provided", () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if hettpRequest has no body", () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should call AuthUseCaseSpy with correct params.", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 401 when invalid credentials are provided.", () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;

    const httpRequest = {
      body: {
        email: "invalidEmail@mail.com",
        password: "invalidPassword",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new AnauthorizedError());
  });

  test("Should return 200 when invalid credentials are provided.", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "validEmail@mail.com",
        password: "validPassword",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
  });

  test("Should return 500 if no AuthUseCase is provided provided.", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if AuthUseCase has no auth method.", () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
