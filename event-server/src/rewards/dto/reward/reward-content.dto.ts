import { IsString, IsNumber, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RewardContentDto {
  @ApiProperty({ example: '이벤트 보너스 포인트' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '이벤트 참여 보너스 포인트' })
  @IsString()   
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ 
    example: { itemCode: 'ITEM_001', rarity: 'RARE' },
    required: false 
  })
  @IsObject()
  @IsNotEmpty()
  metadata: Record<string, any>;
} 