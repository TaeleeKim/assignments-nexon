import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RewardRequestsController, RewardsController } from './reward.controller';
import { RewardsService } from './reward.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REWARD_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'event-server',
            port: 3002,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RewardsController, RewardRequestsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardModule {} 