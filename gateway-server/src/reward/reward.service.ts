import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RewardService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  async createReward(rewardData: any) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'create_reward' }, rewardData),
    );
  }

  async getRewards() {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_rewards' }, {}),
    );
  }

  async getReward(id: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_reward' }, { id }),
    );
  }

  async getEventRewards(eventId: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_event_rewards' }, { eventId }),
    );
  }

  async createRewardRequest(userId: string, requestData: any) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'create_reward_request' }, { userId, ...requestData }),
    );
  }

  async getRewardRequests(userId?: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_reward_requests' }, { userId }),
    );
  }

  async approveRewardRequest(id: string, approverId: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'approve_reward_request' }, { id, approverId }),
    );
  }

  async rejectRewardRequest(id: string, rejectorId: string, reason: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'reject_reward_request' }, { id, rejectorId, reason }),
    );
  }
} 