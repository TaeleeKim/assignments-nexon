import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get gateway status' })
  @ApiResponse({ status: 200, description: 'Returns gateway status message' })
  getHello(): string {
    return this.appService.getHello();
  }
}
