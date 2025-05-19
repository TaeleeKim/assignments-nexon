import { IsEnum, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RewardContentDto } from './reward-content.dto';
import { RewardCategory, PointsType, ItemType, CouponType, CurrencyType, ExperienceType } from '../../schemas/reward.schema';

export class PointsRewardDto extends RewardContentDto {
  @ApiProperty({
    type: String,
    example: 'event123',
    description: '이벤트 ID',
    required: true,
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ 
    enum: RewardCategory, 
    example: RewardCategory.POINTS,
    type: 'string',
    enumName: 'RewardCategory'
  })
  @IsEnum(RewardCategory)
  @IsNotEmpty()
  category: RewardCategory.POINTS;

  @ApiProperty({ 
    enum: PointsType, 
    example: PointsType.BONUS,
    type: 'string',
    enumName: 'PointsType'
  })
  @IsEnum(PointsType, { message: 'Invalid points subType' })
  @IsNotEmpty()
  subType: PointsType;
}

export class ItemRewardDto extends RewardContentDto {
  @ApiProperty({
    type: String,
    example: 'event123',
    description: '이벤트 ID',
    required: true,
  })
  @IsMongoId()
  eventId: string;
  
  @ApiProperty({ 
    enum: RewardCategory, 
    example: RewardCategory.ITEM,
    type: 'string',
    enumName: 'RewardCategory'
  })
  @IsEnum(RewardCategory)
  @IsNotEmpty()
  category: RewardCategory.ITEM;

  @ApiProperty({ 
    enum: ItemType, 
    example: ItemType.GAME_ITEM,
    type: 'string',
    enumName: 'ItemType'
  })
  @IsEnum(ItemType, { message: 'Invalid item subType' })
  @IsNotEmpty()
  subType: ItemType;
}

export class CouponRewardDto extends RewardContentDto {
  @ApiProperty({
    type: String,
    example: 'event123',
    description: '이벤트 ID',
    required: true,
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ 
    enum: RewardCategory, 
    example: RewardCategory.COUPON,
    type: 'string',
    enumName: 'RewardCategory'
  })
  @IsEnum(RewardCategory)
  @IsNotEmpty()
  category: RewardCategory.COUPON;

  @ApiProperty({ 
    enum: CouponType, 
    example: CouponType.DISCOUNT,
    type: 'string',
    enumName: 'CouponType'
  })
  @IsEnum(CouponType, { message: 'Invalid coupon subType' })
  @IsNotEmpty()
  subType: CouponType;
}

export class CurrencyRewardDto extends RewardContentDto {
  @ApiProperty({
    type: String,
    example: 'event123',
    description: '이벤트 ID',
    required: true,
  })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ 
    enum: RewardCategory, 
    example: RewardCategory.CURRENCY,
    type: 'string',
    enumName: 'RewardCategory'
  })
  @IsEnum(RewardCategory)
  @IsNotEmpty()
  category: RewardCategory.CURRENCY;

  @ApiProperty({ 
    enum: CurrencyType, 
    example: CurrencyType.GOLD,
    type: 'string',
    enumName: 'CurrencyType'
  })
  @IsEnum(CurrencyType, { message: 'Invalid currency subType' })
  @IsNotEmpty()
  subType: CurrencyType;
}

export class ExperienceRewardDto extends RewardContentDto {
  @ApiProperty({
    type: String,
    example: 'event123',
    description: '이벤트 ID',
    required: true,
  })
  @IsMongoId()
  eventId: string;
  
  @ApiProperty({ 
    enum: RewardCategory, 
    example: RewardCategory.EXPERIENCE,
    type: 'string',
    enumName: 'RewardCategory'
  })
  @IsEnum(RewardCategory)
  @IsNotEmpty()
  category: RewardCategory.EXPERIENCE;

  @ApiProperty({ 
    enum: ExperienceType, 
    example: ExperienceType.CHARACTER,
    type: 'string',
    enumName: 'ExperienceType'
  })
  @IsEnum(ExperienceType, { message: 'Invalid experience subType' })
  @IsNotEmpty()
  subType: ExperienceType;
} 