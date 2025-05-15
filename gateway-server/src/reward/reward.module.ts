import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EVENT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('EVENT_SERVICE_HOST'),
            port: configService.get('EVENT_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {} 