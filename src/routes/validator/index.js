const AuthSchemaValidator = require("./auth.schema");
// import ProductSchemaValidator from "./product.schema";
// import UserSchemaValidator from "./user.schema";

class RouteValidatorSchema {
  static get Auth() {
    return AuthSchemaValidator;
  }

  // static get Product() {
  //     return ProductSchemaValidator;
  // }

  // static get User() {
  //     return UserSchemaValidator;
  // }
}

module.exports = RouteValidatorSchema;
