import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MsClientServiceService {
  private readonly logger = new Logger(MsClientServiceService.name);

  getClient(id: string): {
    id: string;
    name: string;
    company: string;
    service: string;
  } {
    this.logger.log(`Getting client with ID: ${id}`);
    return {
      id,
      name: `Client ${id}`,
      company: `Company ${id}`,
      service: 'ms-client-service',
    };
  }

  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      service: 'ms-client-service',
      version: '1.0.0',
    };
  }
}
