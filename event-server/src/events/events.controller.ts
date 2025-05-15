import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '이벤트 생성' })
  @ApiResponse({ status: 201, description: '이벤트가 성공적으로 생성됨' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 이벤트 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.eventsService.findActive();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 이벤트 조회' })
  @ApiResponse({ status: 200, description: '이벤트 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 404, description: '이벤트를 찾을 수 없음' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  update(@Param('id') id: string, @Body() updateEventDto: Partial<CreateEventDto>) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
} 