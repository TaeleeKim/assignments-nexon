import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

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
      quest: {
        "id_1": true,
        "id_2": true,
        "id_3": true,
      }
    }
   })
  conditionStatus: Record<string, any>;
} 