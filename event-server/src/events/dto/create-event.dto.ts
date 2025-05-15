import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDate, IsObject, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType, EventStatus } from '../schemas/event.schema';
import { Types } from 'mongoose';

export class CreateEventDto {
  @ApiProperty({ example: 'Summer Event 2024', description: '이벤트 이름' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2024-06-01T00:00:00Z', description: '이벤트 시작일' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-08-31T23:59:59Z', description: '이벤트 종료일' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: 'This is a description of the event', description: '이벤트 설명' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'SUMMER', description: '이벤트 타입' })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ example: 'COMPLETED', description: '이벤트 상태' })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({ example: '{ "condition": "true" }', description: '이벤트 조건' })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @ApiProperty({ example: ['64f1a2b3c4d5e6f7g8h9i0j1'], description: '이벤트에 포함된 보상 ID 목록' })
  @IsArray()
  @IsOptional()
  rewards?: Types.ObjectId[];
} 