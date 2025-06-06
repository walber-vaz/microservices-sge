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
    const serviceName = process.env.SERVICE_NAME || 'unknown';

    // Verificar se é context HTTP ou RPC
    const contextType = context.getType();

    if (contextType === 'http') {
      return this.handleHttpContext(context, next, startTime, serviceName);
    } else if (contextType === 'rpc') {
      return this.handleRpcContext(context, next, startTime, serviceName);
    }

    // Para outros tipos de context, apenas log básico
    return this.handleBasicContext(next, startTime, serviceName);
  }

  private handleHttpContext(
    context: ExecutionContext,
    next: CallHandler,
    startTime: number,
    serviceName: string,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const method = request.method;
    const url = request.url;
    const userAgent = request.headers?.['user-agent'] || 'unknown';
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';

    this.logger.log({
      message: 'Incoming HTTP request',
      method,
      url,
      ip,
      userAgent,
      service: serviceName,
      context: 'HTTP',
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log({
          message: 'HTTP request completed',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          service: serviceName,
          context: 'HTTP',
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - startTime;
        const errorInfo = this.extractErrorInfo(error);

        this.logger.error({
          message: 'HTTP request failed',
          method,
          url,
          error: errorInfo.message,
          stack: errorInfo.stack,
          duration: `${duration}ms`,
          service: serviceName,
          context: 'HTTP',
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }

  private handleRpcContext(
    context: ExecutionContext,
    next: CallHandler,
    startTime: number,
    serviceName: string,
  ): Observable<any> {
    const rpcContext = context.switchToRpc();
    const data: unknown = rpcContext.getData();
    const pattern = context.getHandler().name || 'unknown_pattern';

    this.logger.log({
      message: 'Incoming RPC request',
      pattern,
      data: data ? JSON.stringify(data).substring(0, 100) : 'no data',
      service: serviceName,
      context: 'RPC',
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((result) => {
        const duration = Date.now() - startTime;

        this.logger.log({
          message: 'RPC request completed',
          pattern,
          duration: `${duration}ms`,
          service: serviceName,
          context: 'RPC',
          resultSize: result ? JSON.stringify(result).length : 0,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - startTime;
        const errorInfo = this.extractErrorInfo(error);

        this.logger.error({
          message: 'RPC request failed',
          pattern,
          error: errorInfo.message,
          stack: errorInfo.stack,
          duration: `${duration}ms`,
          service: serviceName,
          context: 'RPC',
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }

  private handleBasicContext(
    next: CallHandler,
    startTime: number,
    serviceName: string,
  ): Observable<any> {
    this.logger.log({
      message: 'Request started',
      service: serviceName,
      context: 'UNKNOWN',
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log({
          message: 'Request completed',
          duration: `${duration}ms`,
          service: serviceName,
          context: 'UNKNOWN',
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - startTime;
        const errorInfo = this.extractErrorInfo(error);

        this.logger.error({
          message: 'Request failed',
          error: errorInfo.message,
          stack: errorInfo.stack,
          duration: `${duration}ms`,
          service: serviceName,
          context: 'UNKNOWN',
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }

  private extractErrorInfo(error: unknown): { message: string; stack: string } {
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

    return { message: errorMessage, stack: errorStack };
  }
}
