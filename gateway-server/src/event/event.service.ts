import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  async createEvent(eventData: any) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'create_event' }, eventData),
    );
  }

  async getEvents() {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_events' }, {}),
    );
  }

  async getEvent(id: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_event' }, { id }),
    );
  }

  async updateEvent(id: string, eventData: any) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'update_event' }, { id, ...eventData }),
    );
  }

  async deleteEvent(id: string) {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'delete_event' }, { id }),
    );
  }

  async getActiveEvents() {
    return firstValueFrom(
      this.eventClient.send({ cmd: 'get_active_events' }, {}),
    );
  }
} 