import { RequestHandler } from "express";

// middleware/combineRequestFields.ts

export const combineRequestFields: RequestHandler = (req, res, next) => {
    const body = Object.assign({}, req.body); // clone to fix prototype issue
  
    (req as any).validated = {
      body,
      file: req.file,
    };
  
    console.log("Combined:", (req as any).validated);
    next();
  };
  
