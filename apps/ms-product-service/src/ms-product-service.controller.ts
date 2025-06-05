import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsProductServiceService } from './ms-product-service.service';

@Controller()
export class MsProductServiceController {
  constructor(
    private readonly msProductServiceService: MsProductServiceService,
  ) {}

  @MessagePattern('get_product')
  getProduct(data: { id: string }) {
    return this.msProductServiceService.getProduct(data.id);
  }

  @MessagePattern('health_product')
  getHealth() {
    return this.msProductServiceService.getHealth();
  }
}
