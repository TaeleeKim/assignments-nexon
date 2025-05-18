import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RewardContentDto } from './reward-content.dto';

export class BaseRewardDto {
  @ApiProperty({ example: 'event123' })
  @IsString()
  eventId: string;

  @ApiProperty({ type: RewardContentDto })
  @ValidateNested()
  @Type(() => RewardContentDto)
  content: RewardContentDto;
} 