import type { Request, Response, NextFunction } from 'express';

const asyncErrorHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error: any) {
      const statusCode: number = error.statusCode || error.status || 500;
      const message: string = error.message || 'Internal Server Error';

     
      res.status(statusCode).json({
        success: false,
        message,
        status: statusCode,
      });

    }
  };
};

export default asyncErrorHandler;
