import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(createEventDto);
    return event.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().populate('rewards').exec();
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
  }
} 