import { Test, TestingModule } from '@nestjs/testing';
import { MsSalesServiceController } from './ms-sales-service.controller';
import { MsSalesServiceService } from './ms-sales-service.service';

describe('MsSalesServiceController', () => {
  let msSalesServiceController: MsSalesServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsSalesServiceController],
      providers: [MsSalesServiceService],
    }).compile();

    msSalesServiceController = app.get<MsSalesServiceController>(MsSalesServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msSalesServiceController.getHello()).toBe('Hello World!');
    });
  });
});
