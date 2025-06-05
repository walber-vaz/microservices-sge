import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiGatewayService } from './api-gateway.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('MS_USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('MS_PRODUCT_SERVICE') private readonly productClient: ClientProxy,
    @Inject('MS_CLIENT_SERVICE') private readonly clientClient: ClientProxy,
    @Inject('MS_SALES_SERVICE') private readonly salesClient: ClientProxy,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  getHealth() {
    return this.apiGatewayService.getHealth();
  }

  @Get('user/:id')
  @ApiTags('users')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userClient.send('get_user', { id });
  }

  @Get('client/:id')
  @ApiTags('clients')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client UUID' })
  getClient(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientClient.send('get_client', { id });
  }

  @Get('product/:id')
  @ApiTags('products')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productClient.send('get_product', { id });
  }

  @Get('sale/:id')
  @ApiTags('sales')
  @ApiOperation({ summary: 'Get sale by ID' })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  getSale(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesClient.send('get_sale', { id });
  }
}
