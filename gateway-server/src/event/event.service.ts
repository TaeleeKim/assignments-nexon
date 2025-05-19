import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy
  ) {}

  async create(createEventDto: CreateEventDto) {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'create' }, createEventDto)
    );
  }

  async findAllSimple(status?: string, type?: string) {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'findAllSimple' }, { status, type })
    );
  }

  async findAllDetailed(status?: string, type?: string) {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'findAllDetailed' }, { status, type })
    );
  }

  async findOne(id: string) {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'findOne' }, { id })
    );
  }

  async findActive() {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'findActive' }, {})
    );
  }

  async update(id: string, updateEventDto: Partial<CreateEventDto>) {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'update' }, { id, updateEventDto })
    );
  }

  async remove(id: string) {
    return await firstValueFrom(
      this.eventClient.emit({ cmd: 'remove' }, { id })
    );
  }
} 