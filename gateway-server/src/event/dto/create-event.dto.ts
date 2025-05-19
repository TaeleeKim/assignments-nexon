import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsDate, IsObject, IsOptional, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType, EventStatus } from '../../interfaces/event.interface';
import { Types } from 'mongoose';

export class CreateEventDto {
  @ApiProperty({ example: 'Summer Event 2025', description: '이벤트 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-05-18T00:00:00Z', description: '이벤트 시작일' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2025-07-18T23:59:59Z', description: '이벤트 종료일' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: '오늘 오전 10시에 이벤트가 시작됩니다. 조건을 만족해주세요.', description: '이벤트 설명' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'LOGIN', description: '이벤트 타입' })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({ example: 'ACTIVE', description: '이벤트 상태' })
  @IsEnum(EventStatus)
  @IsNotEmpty()
  status: EventStatus;

  @ApiProperty({example: false, default: false, description: 'true인 경우 운영자의 승인이 필요요'})
  @IsBoolean()
  @IsNotEmpty()
  needApproval: boolean = false;

  @ApiProperty({ 
    example: {
      login: true,
      invite: true,
      purchase: true,
      quest: 'quest_id_1',
    }, description: '이벤트 조건' })
  @IsObject()
  @IsNotEmpty()
  conditions: Record<string, any>;

  @ApiPropertyOptional({ example: '[]', description: '이벤트에 포함된 보상 ID 목록' })
  @IsArray()
  @IsOptional()
  rewards?: Types.ObjectId[];
} 