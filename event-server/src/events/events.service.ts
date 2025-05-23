import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventStatus, EventType } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Reward } from 'src/rewards/schemas/reward.schema';
import { RewardRequest } from 'src/rewards/schemas/reward-request.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardRequest.name) private readonly rewardRequestModel: Model<RewardRequest>,
  ) {}
  
  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const event = new this.eventModel(createEventDto);
      return event.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Event creation failed');
    } 
  }

  async findAllSimple(status?: string, type?: string): Promise<Partial<Event>[]> {
    const query: any = {};
    
    if (status) {
      query.status = status as EventStatus;
    } 
    if (type) {
      query.type = type as EventType;
    }
    
    return this.eventModel
      .find(query)
      .select('name type conditions')
      .exec();
  }

  async findAllDetailed(status?: string, type?: string): Promise<Event[]> {
    const query: any = {};
    
    if (status) {
      query.status = status as EventStatus;
    }
    if (type) {
      query.type = type as EventType;
    }

    return this.eventModel
      .find(query)
      .populate('rewards')
      .exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).populate('rewards').exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findActive(): Promise<Event[]> {
    const now = new Date();
    return this.eventModel
      .find({
        status: 'ACTIVE',
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .populate('rewards')
      .exec();
  }

  async update(id: string, updateEventDto: Partial<CreateEventDto>): Promise<Event> {
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .populate('rewards')
      .exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Event not found');
    }
    await this.rewardModel.deleteMany({ eventId: new Types.ObjectId(id) }).exec();
    await this.rewardRequestModel.deleteMany({ eventId: new Types.ObjectId(id) }).exec();
  }
} 