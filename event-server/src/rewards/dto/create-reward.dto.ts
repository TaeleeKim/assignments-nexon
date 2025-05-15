import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  points: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  eventId: string;
} 