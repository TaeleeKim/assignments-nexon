import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateRewardDto } from './dto/reward/create-reward.dto';
import { CreateRewardRequestDto } from './dto/reward-request/create-reward-request.dto';
import { CreateRewardResponseDto } from './dto/reward-request/create-reward-response.dto';
import { UpdateRewardRequestDto } from './dto/reward-request/update-reward-request.dto';
import { UpdateRewardResponseDto } from './dto/reward-request/update-reward-response.dto';

@Injectable()
export class RewardsService {
  constructor(
    @Inject('REWARD_SERVICE') private readonly rewardClient: ClientProxy
  ) {}

  async create(createRewardDto: CreateRewardDto) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'create' }, createRewardDto)
    );
  }

  async findAll(eventId?: string) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'findAll' }, { eventId })
    );
  }

  async findOne(id: string) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'findOne' }, { id })
    );
  }

  async createRequest(userId: string, createRewardRequestDto: CreateRewardRequestDto): Promise<CreateRewardResponseDto> {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'createRequest' }, { userId, createRewardRequestDto })
    );
  }

  async findAllRequestsSimple(page: number, limit: number, userId?: string, eventId?: string, status?: string) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'findAllRequestsSimple' }, { page, limit, userId, eventId, status })
    );
  }

  async findOneRequest(id: string) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'findOneRequest' }, { id })
    );
  }

  async approveRequest(id: string, approverId: string) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'approveRequest' }, { id, approverId })
    );
  }

  async rejectRequest(id: string, rejectorId: string, rejectionReason?: string) {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'rejectRequest' }, { id, rejectorId, rejectionReason })
    );
  }
  
  async updateRequestStatus(id: string, updateStatusDto: UpdateRewardRequestDto, userId: string): Promise<UpdateRewardResponseDto> {
    return await firstValueFrom(
      this.rewardClient.emit({ cmd: 'updateRequestStatus' }, { id, updateStatusDto, userId })
    );
  }
} 