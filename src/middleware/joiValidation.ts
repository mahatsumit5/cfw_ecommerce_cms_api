import Joi from "joi";

import { NextFunction, Request, Response } from "express";

const SHORTSTE = Joi.string().min(2).max(100);
const SHORTSTEREQ = Joi.string().min(3).max(100).required();
const LONGTSTR = Joi.string().min(3).max(10000);
const NUM = Joi.number();
const NUMREQ = Joi.number().required();
export const newAdminValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const loginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const newAdminVerificationValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

//new product avlidation
export const newProductValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //define the schema
    req.body.salesPrice = req.body.salesPrice || 0;
    const schema = Joi.object({
      title: SHORTSTEREQ,
      color: Joi.array(),
      size: Joi.array(),
      category: SHORTSTEREQ,
      sku: SHORTSTEREQ,
      status: SHORTSTEREQ,
      qty: NUMREQ,
      price: NUMREQ,
      salesPrice: NUM,
      description: LONGTSTR,
      salesStartDate: Joi.date().allow("", null).iso(),
      salesEndDate: Joi.date().iso().allow(""),

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
export const updateProductValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { _id, status, title } = req.body;
    if (!title) {
      console.log("no data");
      next();
      return;
    }
    if (typeof req.body.images === "string") {
      req.body.images = [req.body.images];
    }

    req.body.salesPrice = req.body.salesPrice || 0;
    req.body.salesStartDate =
      req.body.salesStartDate === "null" || !req.body.salesStartDate
        ? null
        : req.body.salesStartDate;

    req.body.salesEndDate =
      req.body.salesEndDate === "null" || !req.body.salesEndDate
        ? null
        : req.body.salesEndDate;
    const schema = Joi.object({
      _id: SHORTSTEREQ,
      title: SHORTSTEREQ,
      category: SHORTSTEREQ,
      color: Joi.array(),
      size: Joi.array(),
      status: SHORTSTEREQ,
      qty: NUM.min(2),
      price: NUM,
      salesPrice: NUM,
      description: Joi.string().min(1).max(100000).required(),
      salesStartDate: SHORTSTE.allow("", null),
      salesEndDate: SHORTSTE.allow("", null),
      images: Joi.array(),
      thumbnail: LONGTSTR.allow(""),
      reviews: LONGTSTR.allow(""),
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
// payment methods validation
export const newPaymentvalidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //define the schema

    const schema = Joi.object({
      status: SHORTSTEREQ,
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
