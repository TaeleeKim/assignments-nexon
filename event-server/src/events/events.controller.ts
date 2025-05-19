import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UserRole } from '../users/schemas/user.schema';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @EventPattern({ cmd: 'create' })
  create(@Payload() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @EventPattern({ cmd: 'findAllSimple' })
  findAllSimple(@Payload() data: { status?: string; type?: string }) {
    return this.eventsService.findAllSimple(data.status, data.type);
  }

  @EventPattern({ cmd: 'findAllDetailed' })
  findAllDetailed(@Payload() data: { status?: string; type?: string }) {
    return this.eventsService.findAllDetailed(data.status, data.type);
  }

  @EventPattern({ cmd: 'findOne' })
  findOne(@Payload() data: { id: string }) {
    return this.eventsService.findOne(data.id);
  }

  @EventPattern({ cmd: 'findActive' })
  findActive() {
    return this.eventsService.findActive();
  }

  @EventPattern({ cmd: 'update' })
  update(@Payload() data: { id: string; updateEventDto: Partial<CreateEventDto> }) {
    return this.eventsService.update(data.id, data.updateEventDto);
  }

  @EventPattern({ cmd: 'remove' })
  remove(@Payload() data: { id: string }) {
    return this.eventsService.remove(data.id);
  }
} 