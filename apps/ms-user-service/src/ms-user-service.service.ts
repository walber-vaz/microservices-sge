import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MsUserServiceService {
  private readonly logger = new Logger(MsUserServiceService.name);

  getUser(id: string): {
    id: string;
    name: string;
    email: string;
    service: string;
  } {
    this.logger.log(`Getting user with ID: ${id}`);
    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      service: 'ms-user-service',
    };
  }

  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      service: 'ms-user-service',
      version: '1.0.0',
    };
  }
}
