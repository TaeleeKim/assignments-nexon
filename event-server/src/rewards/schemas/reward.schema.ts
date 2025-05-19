import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// 보상 대분류
export enum RewardCategory {
  POINTS = 'POINTS',
  ITEM = 'ITEM',
  COUPON = 'COUPON',
  CURRENCY = 'CURRENCY',
  EXPERIENCE = 'EXPERIENCE',
}

// 포인트 세부 분류
export enum PointsType {
  REGULAR = 'REGULAR',
  BONUS = 'BONUS',
  EVENT = 'EVENT',
  REFERRAL = 'REFERRAL',
}

// 아이템 세부 분류
export enum ItemType {
  GAME_ITEM = 'GAME_ITEM',
  CHARACTER_ITEM = 'CHARACTER_ITEM',
  CONSUMABLE = 'CONSUMABLE',
  EQUIPMENT = 'EQUIPMENT',
}

// 쿠폰 세부 분류
export enum CouponType {
  DISCOUNT = 'DISCOUNT',
  GIFT = 'GIFT',
  EVENT = 'EVENT',
  SPECIAL = 'SPECIAL',
}

// 돈 세부 분류
export enum CurrencyType {
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  PREMIUM = 'PREMIUM',
}

// 경험치 세부 분류
export enum ExperienceType {
  CHARACTER = 'CHARACTER',
  SKILL = 'SKILL',
  GUILD = 'GUILD',
}

export const SUBTYPE_ENUMS = {
  [RewardCategory.POINTS]: PointsType,
  [RewardCategory.ITEM]: ItemType,
  [RewardCategory.COUPON]: CouponType,
  [RewardCategory.CURRENCY]: CurrencyType,
  [RewardCategory.EXPERIENCE]: ExperienceType,
};

export type RewardSubType = PointsType | ItemType | CouponType | CurrencyType | ExperienceType;

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true, enum: RewardCategory })
  category: RewardCategory;

  @Prop({ required: true })
  subType: string;  // 세부 분류 (enum 값)

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: Object, required: true })
  metadata: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;
}

export const RewardSchema = SchemaFactory.createForClass(Reward); 