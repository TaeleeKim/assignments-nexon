import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { RewardRequest, RewardRequestSchema } from './schemas/reward-request.schema';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    EventsModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {} 