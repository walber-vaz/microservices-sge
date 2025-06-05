import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MsSalesServiceService } from './ms-sales-service.service';

@Controller()
export class MsSalesServiceController {
  constructor(private readonly msSalesServiceService: MsSalesServiceService) {}

  @MessagePattern('get_sale')
  getSale(data: { id: string }) {
    return this.msSalesServiceService.getSale(data.id);
  }

  @MessagePattern('health_sale')
  getHealth() {
    return this.msSalesServiceService.getHealth();
  }
}
