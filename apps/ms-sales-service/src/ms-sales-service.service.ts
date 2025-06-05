import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MsSalesServiceService {
  private readonly logger = new Logger(MsSalesServiceService.name);

  getSale(id: string): {
    id: string;
    clientId: string;
    productId: string;
    amount: number;
    total: number;
    service: string;
  } {
    this.logger.log(`Getting sale with ID: ${id}`);
    const amount = Math.floor(Math.random() * 10) + 1;
    const price = Math.floor(Math.random() * 100) + 10;
    return {
      id,
      clientId: `client-${id}`,
      productId: `product-${id}`,
      amount,
      total: amount * price,
      service: 'ms-sales-service',
    };
  }

  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      service: 'ms-sales-service',
      version: '1.0.0',
    };
  }
}
