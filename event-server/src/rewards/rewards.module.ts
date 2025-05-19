import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { RewardRequest, RewardRequestSchema } from './schemas/reward-request.schema';
import { EventsModule } from '../events/events.module';
import { RewardRequestsController } from './rewards.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'strategies/jwt.strategy';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    EventsModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RewardsController, RewardRequestsController],
  providers: [RewardsService, JwtStrategy],
  exports: [RewardsService],
})
export class RewardsModule {} 