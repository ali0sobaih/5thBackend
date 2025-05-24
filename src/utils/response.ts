import { Response } from "express";

// todo: make the pagination in the metadata the way you want!!
// ! i did not want to make a change that effects your code
export const success = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) => {
  if (data && data.warning) {
    const warningHeaders = new Headers({ warning: data.warning });
    res.setHeaders(warningHeaders);
  }
  res.status(statusCode).json({
    ...data,
    metaData: {
      status: statusCode,
      message,
    },
  });
};

export const error = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: number = 500
) => {
  console.log("error:", data);

  res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};
