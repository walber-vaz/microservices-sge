import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiGatewayService {
  constructor(private readonly configService: ConfigService) {}

  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      nodeEnv: this.configService.get<string>('NODE_ENV') || 'development',
      service: 'api-gateway',
    };
  }
}
