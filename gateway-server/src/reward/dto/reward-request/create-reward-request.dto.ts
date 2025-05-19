import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsObject } from 'class-validator';

export class CreateRewardRequestDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ description: '이벤트 ID' })
  eventId: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: '조건 상태', 
    example: {
      login: true,
      invite: true,
      purchase: true,
      quest: 'quest_id_1',
    }
   })
  conditionStatus: Record<string, any>;
} 