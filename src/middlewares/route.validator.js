const z = require("zod");
const { Request, Response, NextFunction } = require("express");

/**
 * This function is used to validate the request body against a zod schema.
 *
 * @param schema Validation schema for the request path.
 * @returns {void}
 */
function routerSchemaValidator(schema) {
  return async (req, res, next) => {
    const { body } = await schema.parseAsync({
      body: req.body,
      param: req.params,
      query: req.query,
    });
    req.body = body;
    next();
  };
}

module.exports = routerSchemaValidator;
