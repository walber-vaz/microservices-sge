import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';

export const createWinstonLogger = (serviceName: string): LoggerService => {
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, context, stack }) => {
      return JSON.stringify({
        timestamp,
        level,
        service: serviceName,
        context: context || serviceName,
        message,
        ...(typeof stack === 'string' ? { stack } : {}),
      });
    }),
  );

  const winstonOptions: WinstonModuleOptions = {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context }) => {
            return `${timestamp} [${context || serviceName}] ${level}: ${message}`;
          }),
        ),
      }),

      new winston.transports.File({
        filename: `./logs/${serviceName}.log`,
        format: logFormat,
      }),
      new winston.transports.File({
        filename: `./logs/${serviceName}-error.log`,
        level: 'error',
        format: logFormat,
      }),
    ],
  };

  return WinstonModule.createLogger(winstonOptions);
};
