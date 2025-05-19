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
import { CreateRewardRequestDto } from './dto/reward-request/create-reward-request.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiBody, ApiExtraModels, ApiOperation, ApiQuery, getSchemaPath, OmitType, ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RewardCategory, SUBTYPE_ENUMS, RewardSubType } from './schemas/reward.schema';
import { REWARD_DTOS } from './dto/reward/create-reward.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RewardContentDto } from './dto/reward/reward-content.dto';

@ApiTags('Rewards')
@Controller('rewards')
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
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 보상 목록 조회' })
  findAll() {
    return this.rewardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 보상 상세 조회' })
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.rewardsService.findOne(id);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: '[only ADMIN, OPERATOR] 이벤트별 보상 조회' })
  findByEvent(@Param('eventId', MongoIdPipe) eventId: string) {
    return this.rewardsService.findByEvent(eventId);
  }
} 

@ApiTags('Reward Requests')
@Controller('rewards/requests')
@UseGuards(JwtAuthGuard)
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
  createRequest(
    @Request() req,
    @Param('eventId', MongoIdPipe) eventId: string,
    @Body() createRewardRequestDto: Omit<CreateRewardRequestDto, 'eventId'>
  ) {
    const rewardRequestDto = {
      ...createRewardRequestDto,
      eventId
    } as CreateRewardRequestDto;
    return this.rewardsService.createRequest(req.user.userId, rewardRequestDto);
  }

  @Get()
  // @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.AUDITOR)
  @ApiOperation({ summary: '[ADMIN, OPERATOR, AUDITOR] 보상 요청 목록 조회' })
  @ApiQuery({ name: 'userId', required: false, description: '사용자 ID로 필터링' })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID로 필터링' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  findAllRequests(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId?: string | undefined,
    @Query('eventId') eventId?: string | undefined,
    @Query('status') status?: string | undefined,
  ) {
    return this.rewardsService.findAllRequests({ userId, eventId, status, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: '[ADMIN, OPERATOR, AUDITOR, USER] 보상 요청 상세 조회' })
  findOneRequest(@Param('id', MongoIdPipe) id: string) {
    return this.rewardsService.findOneRequest(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: '[ADMIN, OPERATOR] 보상 요청 상태 업데이트' })
  updateRequest(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateRequestDto: { status: 'APPROVED' | 'REJECTED', reason?: string },
    @Request() req
  ) {
    return this.rewardsService.updateRequestStatus(id, updateRequestDto, req.user.userId);
  }

  @Get('user/me')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: '[only USER] 내 보상 요청 히스토리 조회' })
  @ApiQuery({ name: 'eventId', required: false, description: '이벤트 ID로 필터링' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMyRequestHistory(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('eventId') eventId?: string | undefined,
  ) {
    // return this.rewardsService.getUserRequestHistory(req.user.userId, { eventId, page, limit });
  }
}