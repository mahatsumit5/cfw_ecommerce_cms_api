import Joi from "joi";
const SHORTSTE = Joi.string().min(3).max(100);
const SHORTSTEREQ = Joi.string().min(3).max(100).required();
const NUM = Joi.number().required();
export const newAdminValidation = (req, res, next) => {
  try {
    //define the schema

    const schema = Joi.object({
      fName: SHORTSTE.required(),
      lName: SHORTSTE.required(),
      phone: SHORTSTEREQ,
      email: Joi.string()
        .email({
          minDomainSegments: 2, //@ and .
          tlds: { allow: ["com"] },
        })
        .required(),
      password: SHORTSTEREQ.min(8),

      //check data agains the rule
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const loginValidation = (req, res, next) => {
  try {
    //define the schema

    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2, //@ and .
          tlds: { allow: ["com"] },
        })
        .required(),
      password: SHORTSTEREQ.min(8).max(20),

      //check data agains the rule
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

export const newAdminVerificationValidation = (req, res, next) => {
  try {
    //define the schema
    const schema = Joi.object({
      e: SHORTSTEREQ.email({ minDomainSegments: 2 }),
      c: SHORTSTEREQ,
    });

    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// payment methods validation
//new product avlidation
export const newProductValidation = (req, res, next) => {
  try {
    //define the schema

    const schema = Joi.object({
      name: SHORTSTEREQ,
      parentCat: SHORTSTEREQ,
      sku: SHORTSTEREQ,
      status: SHORTSTEREQ,
      qty: NUM,
      price: NUM,
      salesPrice: NUM,
      description: Joi.string().min(1).max(100).required(),
      salesStartDate: SHORTSTE.allow("", null),
      salesEndDate: SHORTSTE.allow("", null),

      //check data agains the rule
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
export const newPaymentvalidation = (req, res, next) => {
  try {
    //define the schema

    const schema = Joi.object({
      title: Joi.string().min(2).max(50).required(),
      description: Joi.string().min(1).max(100).required(),

      //check data agains the rule
    });
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};
