import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { RewardRequest, RewardRequestDocument, RewardRequestStatus } from './schemas/reward-request.schema';
import { CreateRewardDto } from './dto/reward/create-reward.dto';
import { CreateRewardRequestDto } from './dto/reward-request/create-reward-request.dto';
import { EventsService } from '../events/events.service';
import { Event, EventStatus } from '../events/schemas/event.schema';

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

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().populate('eventId').exec();
  }

  async findOne(id: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(id).populate('eventId').exec();
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    const rewards = await this.rewardModel.find({ eventId: new Types.ObjectId(eventId) }).populate('eventId').exec();

    if (!rewards || rewards.length === 0) {
      throw new NotFoundException(`No rewards found for event with ID ${eventId}`);
    }
    return rewards;
  }

  async checkCondition(condition: Record<string, any>, conditionStatus: Record<string, any>): Promise<{ result: RewardRequestStatus, checkResult: Record<string, any> }> {
    // 조건 충족 시 true, 미충족 시 false
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

  async transformToRewardRequestSchema(userId: string, condition: Record<string, any>, createRewardRequestDto: CreateRewardRequestDto): Promise<RewardRequest> {
    const { eventId, conditionStatus } = createRewardRequestDto;
    
    // condition 이 operator에 의해 결정되는 경우 -> pending

    const { result, checkResult } = await this.checkCondition(condition, conditionStatus);

    return {
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      status: result,
      history: {
        requestAt: new Date(),
        status: result,
        conditionStatus: checkResult,
      },
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

  async createRequest(userId: string, createRewardRequestDto: CreateRewardRequestDto): Promise<RewardRequestDocument> {
    const { eventId, conditionStatus } = createRewardRequestDto;

    const event = await this.eventsService.findOne(eventId);
    if (!event || event.status !== 'ACTIVE') {
      throw new BadRequestException('Event does not exist or is not active');
    }

    const existingRequest = await this.rewardRequestModel.findOne({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
    });

    if (existingRequest && existingRequest.status === RewardRequestStatus.PENDING) {
      throw new BadRequestException('User already has a pending request for this event');
    }

    if (existingRequest && existingRequest.status === RewardRequestStatus.APPROVED) {
      throw new BadRequestException('User already has a approved request for this event');
    }

    const rewardRequest = await this.transformToRewardRequestSchema(userId, event.conditions, createRewardRequestDto);

    const request = new this.rewardRequestModel(rewardRequest);
    return request.save();
  }

  async findAllRequests(query: any): Promise<RewardRequest[]> {
    return this.rewardRequestModel
      .find(query)
      .populate('eventId')
      .populate('userId')
      .exec();
  }

  async findOneRequest(id: string): Promise<RewardRequestDocument> {
    const request = await this.rewardRequestModel
      .findById(id)
      .populate('eventId')
      .populate('rewardId')
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

  async rejectRequest(id: string, rejectorId: string, reason: string): Promise<RewardRequestDocument> {
    const request = await this.findOneRequest(id);
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    request.status = RewardRequestStatus.REJECTED;
    request.rejectedData = { rejectedAt: new Date(), rejectedBy: new Types.ObjectId(rejectorId), rejectionReason: reason };

    return request.save();
  }

  async updateRequestStatus(id: string, updateStatusDto: { status: 'APPROVED' | 'REJECTED', reason?: string }, userId: string): Promise<RewardRequestDocument> {
    const request = await this.findOneRequest(id);
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }
    // conditionStatus 확인
    // 조건 충족 시 보상 부여
    // 조건 미충족 시 보상 거절
    // 보상 부여 시 보상 공급
    // 보상 거절 시 보상 공급 취소
    return request.save();
    
  }
} 