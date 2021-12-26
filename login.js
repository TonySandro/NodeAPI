const express = require("express");
const router = express.Router();

module.exports = () => {
  const expressRouter = new SignUpRouter();
  router.post("signup", new ExpressRouterAdapter().adapt(expressRouter));
};

class ExpressRouterAdapter {
  static adapt(expressRouter) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body,
      };
      const httpResponse = await expressRouter.route(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
}

// Presentation
class SignUpRouter {
  async route(httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body;
    const user = new SignUpUseCase().signUP(email, password, repeatPassword);
    return {
      status: 200,
      body: user,
    };
  }
}

// Domain
class SignUpUseCase {
  async signUP(email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().add(email, password);
      return user;
    }
  }
}

// Infra 
const mongoose = require("mongoose");
const AccountModel = mongoose.model("Account");

class AddAccountRepository {
  async add(email, password, repeatPassword) {
    const user = await AccountModel.create({ email, password });
    return user;
  }
}
