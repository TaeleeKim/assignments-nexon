import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/interfaces/user.interface';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  createEvent(@Body() eventData: any) {
    return this.eventService.createEvent(eventData);
  }

  @Get()
  getEvents() {
    return this.eventService.getEvents();
  }

  @Get('active')
  getActiveEvents() {
    return this.eventService.getActiveEvents();
  }

  @Get(':id')
  getEvent(@Param('id') id: string) {
    return this.eventService.getEvent(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  updateEvent(@Param('id') id: string, @Body() eventData: any) {
    return this.eventService.updateEvent(id, eventData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
} 