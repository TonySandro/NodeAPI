const validator = require("validator");

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

const makeSut = () => {
  return new EmailValidator();
};

describe("Email validator", () => {
  test("Should return true if validator returns true", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid@email.com");
    expect(isEmailValid).toBe(true);
  });
});

describe("Email validator", () => {
  test("Should return false if validator returns false", () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid@email.com");
    expect(isEmailValid).toBe(false);
  });
});
