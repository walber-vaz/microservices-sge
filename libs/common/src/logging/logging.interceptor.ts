import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import type { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const method = request.method;
    const url = request.url;
    const userAgent = request.headers['user-agent'] || '';
    const ip = request.ip || request.connection.remoteAddress;
    const serviceName = process.env.SERVICE_NAME || 'unknown';

    this.logger.log({
      message: 'Incoming request',
      method,
      url,
      ip,
      userAgent,
      service: serviceName,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log({
          message: 'Request completed',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          service: serviceName,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - startTime;

        let errorMessage = '';
        let errorStack = '';
        if (error instanceof Error) {
          errorMessage = error.message;
          errorStack = error.stack || '';
        } else if (
          typeof error === 'object' &&
          error !== null &&
          'message' in error
        ) {
          errorMessage = String((error as Error).message);
          errorStack = String((error as Error).stack || '');
        } else {
          errorMessage = String(error);
        }

        this.logger.error({
          message: 'Request failed',
          method,
          url,
          error: errorMessage,
          stack: errorStack,
          duration: `${duration}ms`,
          service: serviceName,
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }
}
