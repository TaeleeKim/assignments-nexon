import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './schemas/event.schema';
import { RewardRequest } from 'src/rewards/schemas/reward-request.schema';
import { RewardSchema } from 'src/rewards/schemas/reward.schema';
import { RewardRequestSchema } from 'src/rewards/schemas/reward-request.schema';
import { Reward } from 'src/rewards/schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },  
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {} 