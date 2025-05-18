import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Patch,
  Query,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/reward/create-reward.dto';
import { CreateRewardRequestDto } from './dto/reward-request/create-reward-request.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiBody, ApiExtraModels, ApiOperation, ApiQuery, getSchemaPath, OmitType } from '@nestjs/swagger';
import { RewardCategory, SUBTYPE_ENUMS, RewardSubType } from './schemas/reward.schema';
import { BaseRewardDto } from './dto/reward/base-reward.dto';
import { REWARD_DTOS } from './dto/reward/create-reward.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';

@Controller('rewards')
@ApiExtraModels(...Object.values(REWARD_DTOS))
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 보상 생성' })
  @ApiQuery({ 
    name: 'category', 
    enum: RewardCategory,
    description: '보상 카테고리',
    required: true 
  })
  @ApiQuery({ 
    name: 'subType', 
    description: '보상 세부 유형',
    required: true,
    enum: Object.values(SUBTYPE_ENUMS).flatMap(enumObj => Object.values(enumObj))
  })
  @ApiBody({
    type: BaseRewardDto
  })
  create(
    @Query('category') category: RewardCategory,
    @Query('subType') subType: RewardSubType,
    @Body() createRewardDto: Omit<CreateRewardDto, 'category' | 'subType'>
  ) {
    const rewardDto = {
      ...createRewardDto,
      category,
      subType
    } as CreateRewardDto;
    return this.rewardsService.create(rewardDto);
  }

  @Get()
  @ApiOperation({ summary: '[except AUDITOR] 보상 목록 조회' })
  findAll() {
    return this.rewardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[except AUDITOR] 보상 상세 조회' })
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.rewardsService.findOne(id);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: '[except AUDITOR] 이벤트별 보상 조회' })
  findByEvent(@Param('eventId', MongoIdPipe) eventId: string) {
    return this.rewardsService.findByEvent(eventId);
  }

  @Post('request')
  @Roles(UserRole.USER)
  createRequest(
    @Request() req,
    @Body() createRewardRequestDto: CreateRewardRequestDto,
  ) {
    return this.rewardsService.createRequest(req.user.userId, createRewardRequestDto);
  }

  @Get('request/all')
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  findAllRequests() {
    return this.rewardsService.findAllRequests();
  }

  @Get('request/user')
  @Roles(UserRole.USER)
  findUserRequests(@Request() req) {
    return this.rewardsService.findAllRequests(req.user.userId);
  }

  @Get('request/:id')
  findOneRequest(@Param('id', MongoIdPipe) id: string) {
    return this.rewardsService.findOneRequest(id);
  }

  @Patch('request/:id/approve')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  approveRequest(@Param('id', MongoIdPipe) id: string, @Request() req) {
    return this.rewardsService.approveRequest(id, req.user.userId);
  }

  @Patch('request/:id/reject')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  rejectRequest(
    @Param('id', MongoIdPipe) id: string,
    @Request() req,
    @Body('reason') reason: string,
  ) {
    return this.rewardsService.rejectRequest(id, req.user.userId, reason);
  }
} 