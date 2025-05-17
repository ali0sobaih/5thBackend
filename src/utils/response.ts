import { Response } from "express";

export const success = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) => {
  if (data.warning) {
    const warningHeaders = new Headers({ warning: data.warning });
    res.setHeaders(warningHeaders);
  }
  res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

export const error = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: number = 500
) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};
