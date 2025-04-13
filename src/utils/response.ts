import { Response } from 'express';

export const success = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: number = 200
) => {
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
