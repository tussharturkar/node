// logger.middleware.ts

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const { method, url } = req;
      const statusCode = res.statusCode;

      this.logger.log(`${method} ${url} ${statusCode} ${elapsedTime} ms`);
    });

    next();
  }
}
