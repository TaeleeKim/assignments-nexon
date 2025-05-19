import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy
  ) {}

  async create(createEventDto: CreateEventDto) {
    return await this.eventClient.send('create', createEventDto);
  }

  async findAllSimple(status?: string, type?: string) {
    return await this.eventClient.send('findAllSimple', { status });
  }

  async findAllDetailed(status?: string, type?: string) {
    return await this.eventClient.send('findAllDetailed', { status, type });
  }

  async findOne(id: string) {
    return await this.eventClient.send('findOne', { id });
  }

  async findActive() {
    return await this.eventClient.send('findActive', {});
  }

  async update(id: string, updateEventDto: Partial<CreateEventDto>) {
    return await this.eventClient.send('update', { id, ...updateEventDto });
  }

  async remove(id: string) {
    return await this.eventClient.send('remove', { id });
  }
} 