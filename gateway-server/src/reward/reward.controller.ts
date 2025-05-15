import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { RewardService } from './reward.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/interfaces/user.interface';

@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  createReward(@Body() rewardData: any) {
    return this.rewardService.createReward(rewardData);
  }

  @Get()
  getRewards() {
    return this.rewardService.getRewards();
  }

  @Get(':id')
  getReward(@Param('id') id: string) {
    return this.rewardService.getReward(id);
  }

  @Get('event/:eventId')
  getEventRewards(@Param('eventId') eventId: string) {
    return this.rewardService.getEventRewards(eventId);
  }

  @Post('request')
  @Roles(UserRole.USER)
  createRewardRequest(@Request() req, @Body() requestData: any) {
    return this.rewardService.createRewardRequest(req.user.userId, requestData);
  }

  @Get('request/all')
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  getAllRewardRequests() {
    return this.rewardService.getRewardRequests();
  }

  @Get('request/user')
  @Roles(UserRole.USER)
  getUserRewardRequests(@Request() req) {
    return this.rewardService.getRewardRequests(req.user.userId);
  }

  @Patch('request/:id/approve')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  approveRewardRequest(@Param('id') id: string, @Request() req) {
    return this.rewardService.approveRewardRequest(id, req.user.userId);
  }

  @Patch('request/:id/reject')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  rejectRewardRequest(
    @Param('id') id: string,
    @Request() req,
    @Body('reason') reason: string,
  ) {
    return this.rewardService.rejectRewardRequest(id, req.user.userId, reason);
  }
} 