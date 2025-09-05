import type { Response } from "express";

class ApiResponse<responseObj = object> {
  statusCode: number;
  data?: responseObj;
  message: string;
  success: boolean;

  constructor({
    statusCode,
    data,
    message = "Success",
  }: {
    statusCode: number;
    data?: responseObj;
    message?: string;
  }) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data ?? null, 
    });
  }
}

export { ApiResponse };
