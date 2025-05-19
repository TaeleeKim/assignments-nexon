import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/reward/create-reward.dto';
import { UserRole } from '../users/schemas/user.schema';
import { ApiBody, ApiExtraModels, ApiOperation, ApiQuery, getSchemaPath, OmitType, ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RewardCategory, SUBTYPE_ENUMS, RewardSubType, Reward } from './schemas/reward.schema';
import { REWARD_DTOS } from './dto/reward/create-reward.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RewardContentDto } from './dto/reward/reward-content.dto';
import { CreateRewardRequestDto } from './dto/reward-request/create-reward-request.dto';
import { CreateRewardResponseDto } from './dto/reward-request/create-reward-response.dto';
import { UpdateRewardRequestDto } from './dto/reward-request/update-reward-request.dto';
import { UpdateRewardResponseDto } from './dto/reward-request/update-reward-response.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@ApiTags('Rewards')
@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiExtraModels(...Object.values(REWARD_DTOS))
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @EventPattern({ cmd: 'create' })
  create(@Payload() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @EventPattern({ cmd: 'findAll' })
  findAll(@Payload() data: { eventId?: string }) {
    return this.rewardsService.findAll(data.eventId);
  }

  @EventPattern({ cmd: 'findOne' })
  findOne(@Payload() data: { id: string }) {
    return this.rewardsService.findOne(data.id);
  }
}

@ApiTags('Reward Requests')
@Controller('reward-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RewardRequestsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @EventPattern({ cmd: 'createRequest' })
  async createRequest(@Payload() data: { userId: string; createRewardRequestDto: CreateRewardRequestDto }) {
    return await this.rewardsService.createRequest(data.userId, data.createRewardRequestDto);
  }

  @EventPattern({ cmd: 'findAllRequestsSimple' })
  findAllRequests(@Payload() data: { 
    page: number; 
    limit: number; 
    userId?: string; 
    eventId?: string; 
    status?: string; 
  }) {
    return this.rewardsService.findAllRequestsSimple(
      data.page,
      data.limit,
      data.userId,
      data.eventId,
      data.status
    );
  }

  @EventPattern({ cmd: 'findOneRequest' })
  findOneRequest(@Payload() data: { id: string }) {
    return this.rewardsService.findOneRequest(data.id);
  }

  @EventPattern({ cmd: 'updateRequestStatus' })
  async updateRequest(@Payload() data: { 
    id: string; 
    updateRequestDto: UpdateRewardRequestDto; 
    userId: string; 
  }) {
    return await this.rewardsService.updateRequestStatus(
      data.id,
      data.updateRequestDto,
      data.userId
    );
  }

  @Get('user/me')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: '[only USER] 내 보상 요청 히스토리 조회' })
  @ApiQuery({ name: 'page', required: true, default: 1, type: Number })
  @ApiQuery({ name: 'limit', required: true, default: 10, type: Number })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID로 필터링' })
  getMyRequestHistory(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('eventId', MongoIdPipe) eventId?: string | undefined,
  ) {
    return this.rewardsService.findAllRequestsSimple(page, limit, req.user.userId, eventId);
  }
}