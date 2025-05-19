import { IsString, IsNumber, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RewardContentDto {
  @ApiProperty({ example: '2025년 여름 이벤트 보상' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '보너스 포인트와 아이템 보상' })
  @IsString()   
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      itemCode: 'ITEM_001',
      rarity: 'RARE',
      quantity: 1000,
    },
    required: true,
  })
  metadata: Record<string, any>;
} 