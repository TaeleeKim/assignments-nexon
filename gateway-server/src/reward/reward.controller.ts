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
import { RewardsService } from './reward.service';
import { CreateRewardDto } from './dto/reward/create-reward.dto';
import { UserRole } from '../interfaces/user.interface';
import { ApiBody, ApiExtraModels, ApiOperation, ApiQuery, OmitType, ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RewardCategory, SUBTYPE_ENUMS, RewardSubType } from '../interfaces/reward.interface';
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

@ApiTags('Rewards')
@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiExtraModels(...Object.values(REWARD_DTOS))
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post(':eventId')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 보상 생성' })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 ID',
    required: true,
    type: String,
  })
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
    description: 'conditionStatus 예시: ITEM/GAME_ITEM -> {itemCode: "ITEM_001", rarity: "RARE"}, POINTS/REGULAR -> {quantity: 1000}',
    type: RewardContentDto  
  })
  create(
    @Param('eventId', MongoIdPipe) eventId: string,
    @Query('category') category: RewardCategory,
    @Query('subType') subType: RewardSubType,
    @Body() createRewardDto: Omit<CreateRewardDto, 'category' | 'subType' | 'eventId'>
  ) {
    const rewardDto = {
      ...createRewardDto,
      eventId,
      category,
      subType
    } as CreateRewardDto;
    return this.rewardsService.create(rewardDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 보상 목록 조회' })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID로 필터링' })
  findAll(@Query('eventId') eventId?: string) {
    return this.rewardsService.findAll(eventId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 보상 상세 조회' })
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.rewardsService.findOne(id);
  }
} 

@ApiTags('Reward Requests')
@Controller('reward-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RewardRequestsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post(':eventId')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: '[only USER] 보상 요청 생성' })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 ID',
    required: true,
    type: String,
  })
  @ApiBody({
    type: OmitType(CreateRewardRequestDto, ['eventId'])
  })
  @ApiResponse({
    status: 200,
    description: '보상 요청 생성, 자동 승인 시 Reward 목록 반환',
    type: CreateRewardResponseDto
  })
  async createRequest(
    @Request() req,
    @Param('eventId', MongoIdPipe) eventId: string,
    @Body() createRewardRequestDto: Omit<CreateRewardRequestDto, 'eventId'>
  ): Promise<CreateRewardResponseDto> {
    const rewardRequestDto = {
      ...createRewardRequestDto,
      eventId
    } as CreateRewardRequestDto;
    return await this.rewardsService.createRequest(req.user.userId, rewardRequestDto);
  }
 
  @Get()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  @ApiOperation({ summary: '[ADMIN, OPERATOR, AUDITOR] 보상 요청 목록 조회' })
  @ApiQuery({ name: 'userId', required: false, description: '사용자 ID로 필터링' })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID로 필터링' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @ApiQuery({ name: 'page', required: true, default: 1, type: Number })
  @ApiQuery({ name: 'limit', required: true, default: 10, type: Number })
  async findAllRequests(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId?: string | undefined,
    @Query('eventId') eventId?: string | undefined,
    @Query('status') status?: string | undefined,
  ) {
    return await this.rewardsService.findAllRequestsSimple(page, limit, userId, eventId, status);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  @ApiOperation({ summary: '[ADMIN, AUDITOR] 보상 요청 상세 조회' })
  async findOneRequest(@Param('id', MongoIdPipe) id: string) {
    return await this.rewardsService.findOneRequest(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[ADMIN, OPERATOR] 보상 요청 상태 업데이트' })
  async updateRequest(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateRequestDto: UpdateRewardRequestDto,
    @Request() req
  ): Promise<UpdateRewardResponseDto> {
    return await this.rewardsService.updateRequestStatus(id, updateRequestDto, req.user.userId);
  }

  @Get('user/me')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: '[only USER] 내 보상 요청 히스토리 조회' })
  @ApiQuery({ name: 'page', required: true, default: 1, type: Number })
  @ApiQuery({ name: 'limit', required: true, default: 10, type: Number })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID로 필터링' })
  async getMyRequestHistory(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('eventId', MongoIdPipe) eventId?: string | undefined,
  ) {
    return await this.rewardsService.findAllRequestsSimple(page, limit, req.user.userId, eventId);
  }
}