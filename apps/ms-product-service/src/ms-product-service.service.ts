import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MsProductServiceService {
  private readonly logger = new Logger(MsProductServiceService.name);

  getProduct(id: string): {
    id: string;
    name: string;
    price: number;
    category: string;
    service: string;
  } {
    this.logger.log(`Getting product with ID: ${id}`);
    return {
      id,
      name: `Product ${id}`,
      price: Math.floor(Math.random() * 1000) + 10,
      category: `Category ${id}`,
      service: 'ms-product-service',
    };
  }

  getHealth(): Record<string, unknown> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      service: 'ms-product-service',
      version: '1.0.0',
    };
  }
}
