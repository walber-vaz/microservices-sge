import { Test, TestingModule } from '@nestjs/testing';
import { MsProductServiceController } from './ms-product-service.controller';
import { MsProductServiceService } from './ms-product-service.service';

describe('MsProductServiceController', () => {
  let msProductServiceController: MsProductServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsProductServiceController],
      providers: [MsProductServiceService],
    }).compile();

    msProductServiceController = app.get<MsProductServiceController>(MsProductServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msProductServiceController.getHello()).toBe('Hello World!');
    });
  });
});
