import Joi from "joi";
const SHORTSTE = Joi.string().min(3).max(100);
const SHORTSTEREQ = Joi.string().min(3).max(100).required();
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
