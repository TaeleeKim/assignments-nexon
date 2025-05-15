import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(id);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
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
  findOneRequest(@Param('id') id: string) {
    return this.rewardsService.findOneRequest(id);
  }

  @Patch('request/:id/approve')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  approveRequest(@Param('id') id: string, @Request() req) {
    return this.rewardsService.approveRequest(id, req.user.userId);
  }

  @Patch('request/:id/reject')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  rejectRequest(
    @Param('id') id: string,
    @Request() req,
    @Body('reason') reason: string,
  ) {
    return this.rewardsService.rejectRequest(id, req.user.userId, reason);
  }
} 