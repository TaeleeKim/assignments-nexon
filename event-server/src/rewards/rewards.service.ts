import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { RewardRequest, RewardRequestDocument, RewardRequestStatus } from './schemas/reward-request.schema';
import { CreateRewardDto } from './dto/reward/create-reward.dto';
import { CreateRewardRequestDto } from './dto/reward-request/create-reward-request.dto';
import { EventsService } from '../events/events.service';
import { Event, EventStatus } from '../events/schemas/event.schema';
import { UpdateRewardRequestDto } from './dto/reward-request/update-reward-request.dto';
import { CreateRewardResponseDto } from './dto/reward-request/create-reward-response.dto';
import { UpdateRewardResponseDto } from './dto/reward-request/update-reward-response.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardRequest.name) private readonly rewardRequestModel: Model<RewardRequest>,
    private readonly eventsService: EventsService,
  ) { }

  private transformToRewardSchema(createRewardDto: CreateRewardDto): Partial<Reward> {
    return {
      eventId: new Types.ObjectId(createRewardDto.eventId),
      category: createRewardDto.category,
      subType: createRewardDto.subType,
      name: createRewardDto.name,
      description: createRewardDto.description,
      imageUrl: createRewardDto.imageUrl ?? undefined,
      metadata: createRewardDto.metadata,
    };
  }

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const event: Event = await this.eventsService.findOne(createRewardDto.eventId) as Event;
    if (!event || event.status !== EventStatus.ACTIVE) {
      throw new BadRequestException('Event does not exist or is not active');
    }

    const createdReward = new this.rewardModel(this.transformToRewardSchema(createRewardDto));
    const savedReward = await createdReward.save();

    await this.eventsService.update(createRewardDto.eventId, {
      rewards: [...((event.rewards || []) as Types.ObjectId[]), savedReward._id as Types.ObjectId],
    });

    return savedReward;
  }

  async findAll(eventId?: string): Promise<Reward[]> {
    const query = eventId ? { eventId: new Types.ObjectId(eventId) } : {};
    const rewards = await this.rewardModel.find(query).exec();

    if (!rewards || rewards.length === 0) {
      throw new NotFoundException(`No rewards found for event with ID ${eventId}`);
    }
    return rewards;
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).populate('eventId').exec();
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async checkCondition(condition: Record<string, any>, conditionStatus: Record<string, any>): Promise<{ result: RewardRequestStatus, checkResult: Record<string, any> }> {
    let result = true;
    let checkResult = {};
    const keys = Object.keys(condition);
    for (const key of keys) {
      if (!conditionStatus.hasOwnProperty(key)) {
        throw new BadRequestException(`Condition key ${key} does not exist in request`);
      }
      const isMet = condition[key] === conditionStatus[key];
      checkResult[key] = {
        required: condition[key],
        actual: conditionStatus[key],
        isMet,
      };
      result = result && isMet;
    }
    return {
      result: result ? RewardRequestStatus.APPROVED : RewardRequestStatus.REJECTED,
      checkResult,
    };
  }

  async createNewRewardRequestSchema(userId: string, event: Event, createRewardRequestDto: CreateRewardRequestDto): Promise<RewardRequest> {
    const { eventId, conditionStatus } = createRewardRequestDto;
    
    const { result, checkResult } = await this.checkCondition(event.conditions, conditionStatus);
    
    // 조건 만족 여부가 operator에 의해 결정되는 경우 -> pending
    // 조건 만족 여부가 시스템에 의해 결정되는 경우 -> approved or rejected
    const status = event.needApproval ? RewardRequestStatus.PENDING : result;

    return {
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      status: status,
      history: [{
        requestAt: new Date(),
        status: result,
        conditionStatus: checkResult,
      }],
      approvedData: result === RewardRequestStatus.APPROVED ? {
        approvedAt: new Date(),
        approvedBy: null,
      } : undefined,
      rejectedData: result === RewardRequestStatus.REJECTED ? {
        rejectedAt: new Date(),
        rejectedBy: null,
        rejectionReason: '',
      } : undefined,
    };
  }

  async createRequest(userId: string, createRewardRequestDto: CreateRewardRequestDto): Promise<CreateRewardResponseDto> {
    const { eventId, conditionStatus } = createRewardRequestDto;

    const event = await this.eventsService.findOne(eventId);
    if (!event || event.status !== 'ACTIVE' || new Date() > event.endDate) {
      throw new BadRequestException('Event does not exist, is not active, or has ended');
    }

    const existingRequest = await this.rewardRequestModel.findOne({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
    });

    let currentStatus = RewardRequestStatus.REJECTED;
    if(existingRequest) {
      if(existingRequest.status === RewardRequestStatus.PENDING) {
        throw new BadRequestException('User already has a pending request for this event');
      }
      if(existingRequest.status === RewardRequestStatus.APPROVED) {
        throw new BadRequestException('User already has a approved request for this event');
      }

      // 이미 요청이 있고, 거절된 경우 -> 현재 상태 update & 히스토리 추가
      const { result, checkResult } = await this.checkCondition(event.conditions, conditionStatus);
      currentStatus = result;
      existingRequest.status = currentStatus;
      await this.rewardRequestModel.updateOne(
        { _id: existingRequest._id },
        { 
          $push: { 
            history: {
              requestAt: new Date(),
              status: currentStatus,
              conditionStatus: checkResult,
            }
          }
        }
      );
    }
    else {
      const rewardRequest = await this.createNewRewardRequestSchema(userId, event, createRewardRequestDto);
      const request = new this.rewardRequestModel(rewardRequest);
      await request.save();
      currentStatus = rewardRequest.status;
    }

    let rewards: Reward[] = [];
    if(currentStatus === RewardRequestStatus.APPROVED) {
      rewards = await this.findAll(eventId);
    }
    return {
      status: currentStatus,
      rewards,
    };
  }

  async findAllRequestsSimple(page: number, limit: number, userId?: string, eventId?: string, status?: string, ): Promise<RewardRequest[]> {
    const query: any = {};
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }
    if (eventId) {
      query.eventId = new Types.ObjectId(eventId);
    }
    if (status) {
      query.status = status;
    }
    return this.rewardRequestModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOneRequest(id: string): Promise<RewardRequestDocument> {
    const request = await this.rewardRequestModel
      .findById(id)
      .populate('eventId')
      .populate('userId')
      .exec();
    if (!request) {
      throw new NotFoundException('Reward request not found');
    }
    return request;
  }

  async approveRequest(id: string, approverId: string): Promise<RewardRequestDocument> {
    const request = await this.findOneRequest(id);
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    request.status = RewardRequestStatus.APPROVED;
    request.approvedData = { approvedAt: new Date(), approvedBy: new Types.ObjectId(approverId) };

    return request.save();
  }

  async rejectRequest(id: string, rejectorId: string, rejectionReason?: string): Promise<RewardRequestDocument> {
    const request = await this.findOneRequest(id);
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    request.status = RewardRequestStatus.REJECTED;
    request.rejectedData = { rejectedAt: new Date(), rejectedBy: new Types.ObjectId(rejectorId), rejectionReason: rejectionReason ?? ``};

    return request.save();
  }

  async updateRequestStatus(id: string, updateStatusDto: UpdateRewardRequestDto, userId: string): Promise<UpdateRewardResponseDto> {
    const request = await this.findOneRequest(id);
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }
    let rewards: Reward[] = [];
    if(updateStatusDto.status === RewardRequestStatus.APPROVED) {
      rewards = await this.findAll(request.eventId.toString());
    }

    if(updateStatusDto.status === RewardRequestStatus.APPROVED) {
      await this.approveRequest(id, userId);
    }
    else if(updateStatusDto.status === RewardRequestStatus.REJECTED) {
      await this.rejectRequest(id, userId, updateStatusDto.rejectionReason);
    }

    return new UpdateRewardResponseDto(updateStatusDto.status, rewards, request.approvedData, request.rejectedData);
  }
}   