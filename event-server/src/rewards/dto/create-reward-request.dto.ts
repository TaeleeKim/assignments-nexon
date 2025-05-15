import { IsMongoId, IsObject, IsOptional } from 'class-validator';

export class CreateRewardRequestDto {
  @IsMongoId()
  eventId: string;

  @IsMongoId()
  rewardId: string;

  @IsObject()
  @IsOptional()
  requestData?: Record<string, any>;
} 