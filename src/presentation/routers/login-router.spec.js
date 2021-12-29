const LoginRouter = require("./login-router");
const MissingParamError = require("../helpers/missing-param-error");
const InvalidParamError = require("../helpers/InvalidParam-error");
const AnauthorizedError = require("../helpers/anauthorized-error");
const ServerError = require("../helpers/server-error");

/* 
Designer pattern Factory. 
Para evitar que quando mude a instancia de um objeto, 
afete todos os lugares que usavam o mesmo.
*/
const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidator();
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      return this.isEmailValid;
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid() {
      throw Error();
    }
  }
  return new EmailValidatorSpy();
};

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = "valid_token";
  return authUseCaseSpy;
};

const makeWithError = () => {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpy();
};

describe("Login Router", () => {
  test("Should return 400 if no email is provided.", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided.", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 500 if no hettpRequest is provided.", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if hettpRequest has no body.", async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should call AuthUseCaseSpy with correct params.", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 401 when invalid credentials are provided.", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;

    const httpRequest = {
      body: {
        email: "invalidEmail@mail.com",
        password: "invalidPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new AnauthorizedError());
  });

  test("Should return 200 when invalid credentials are provided.", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "validEmail@mail.com",
        password: "validPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("Should return 500 if no AuthUseCase is provided.", async () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if AuthUseCase has no auth method.", async () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if AuthUseCase throws.", async () => {
    const authUseCaseSpy = makeWithError();

    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 400 if an invalid email is provided.", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: "invalidEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should return 500 if no EmailValidator is provided.", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if EmailValidator has no isValid method.", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy, {});
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if EmailValidator throws.", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidatorWithError();

    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = {
      body: {
        email: "anyEmail@mail.com",
        password: "anyPassword",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
