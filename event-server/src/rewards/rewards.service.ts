import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { RewardRequest, RewardRequestDocument } from './schemas/reward-request.schema';
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
    const { eventId, category, subType, content } = createRewardDto;

    return {
      eventId: new Types.ObjectId(eventId),
      category,
      subType,
      name: content.name,
      description: content.description,
      quantity: content.quantity,
      imageUrl: content.imageUrl ?? undefined,
      metadata: content.metadata,
    };
  }

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const event: Event = await this.eventsService.findOne(createRewardDto.eventId) as Event;
    if (!event || event.status !== EventStatus.ACTIVE) {
      throw new BadRequestException('Event does not exist or is not active');
    }

    const rewardData = this.transformToRewardSchema(createRewardDto);
    const createdReward = new this.rewardModel(rewardData);
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

  async createRequest(userId: string, createRewardRequestDto: CreateRewardRequestDto): Promise<RewardRequestDocument> {
    const { eventId, rewardId } = createRewardRequestDto;

    // Check if event exists and is active
    const event = await this.eventsService.findOne(eventId);
    if (event.status !== 'ACTIVE') {
      throw new BadRequestException('Event is not active');
    }

    // Check if reward exists and belongs to the event
    const reward = await this.findOne(rewardId);
    if (reward.eventId.toString() !== eventId) {
      throw new BadRequestException('Reward does not belong to the specified event');
    }

    // Check if user already has a pending request for this event
    const existingRequest = await this.rewardRequestModel.findOne({
      userId,
      eventId,
      status: 'PENDING',
    });

    if (existingRequest) {
      throw new BadRequestException('User already has a pending request for this event');
    }

    const request = new this.rewardRequestModel({
      userId,
      ...createRewardRequestDto,
    });

    return request.save();
  }

  async findAllRequests(userId?: string): Promise<RewardRequest[]> {
    const query = userId ? { userId } : {};
    return this.rewardRequestModel
      .find(query)
      .populate('eventId')
      .populate('rewardId')
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

    request.status = 'APPROVED';
    // request.approvedBy = approverId;
    request.responseData = { approvedAt: new Date() };

    return request.save();
  }

  async rejectRequest(id: string, rejectorId: string, reason: string): Promise<RewardRequestDocument> {
    const request = await this.findOneRequest(id);
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not pending');
    }

    request.status = 'REJECTED';
    // request.rejectedBy = rejectorId;
    request.rejectionReason = reason;
    request.responseData = { rejectedAt: new Date() };

    return request.save();
  }
} 