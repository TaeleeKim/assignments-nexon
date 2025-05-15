import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EventController } from './event.controller';
import { EventService } from './event.service';

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
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {} 