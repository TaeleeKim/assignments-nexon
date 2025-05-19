import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody, PartialType } from '@nestjs/swagger';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 이벤트 생성' })
  @ApiResponse({ status: 201, description: '이벤트가 성공적으로 생성됨' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiBody({ type: CreateEventDto })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER)
  @ApiOperation({ summary: '[except AUDITOR] 이벤트 목록 조회' })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'ENDED'] })
  @ApiQuery({ name: 'type', required: false, enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'SPECIAL'] })
  @ApiQuery({ name: 'detailed', default: false, required: false, type: Boolean, description: '상세 정보 포함 여부' })
  @ApiResponse({ status: 200, description: '이벤트 목록 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  async findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('detailed', new DefaultValuePipe(false), ParseBoolPipe) detailed?: boolean,
  ) {
    if (detailed) {
      return this.eventsService.findAllDetailed(status, type);
    }
    return this.eventsService.findAllSimple(status, type);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER)
  @ApiOperation({ summary: '[except AUDITOR] 특정 이벤트 조회' })
  @ApiParam({ name: 'id', description: '이벤트 ID' })
  @ApiResponse({ status: 200, description: '이벤트 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 404, description: '이벤트를 찾을 수 없음' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 이벤트 수정' })
  @ApiParam({ name: 'id', description: '이벤트 ID' })
  @ApiResponse({ status: 200, description: '이벤트 수정 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @ApiBody({ type: PartialType(CreateEventDto) }) 
  update(@Param('id', MongoIdPipe) id: string, @Body() updateEventDto: Partial<CreateEventDto>) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 이벤트 삭제' })
  @ApiParam({ name: 'id', description: '이벤트 ID' })
  @ApiResponse({ status: 200, description: '이벤트 삭제 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.eventsService.remove(id);
  }
} 