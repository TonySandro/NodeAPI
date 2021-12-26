class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe("Login Router", () => {
  test("Sgould return 400 if no email is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: "anyPassword",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Sgould return 400 if no password is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "anyEmail",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
