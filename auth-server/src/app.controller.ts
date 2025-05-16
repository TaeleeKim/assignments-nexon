import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '앱 상태 확인' })
  @ApiResponse({ status: 200, description: '앱 상태 확인' })
  getHello(): string {
    return this.appService.getHello();
  }
}
