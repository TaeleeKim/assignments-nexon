import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor() {}
  @Get('health')
  @ApiOperation({ summary: '앱 상태 확인' })
  @ApiResponse({ status: 200, description: '앱 상태 확인' })
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
