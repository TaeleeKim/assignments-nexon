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

export enum RewardRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
  }
  

  export class Reward {
    category: RewardCategory;
  
    subType: string;  // 세부 분류 (enum 값)
  
    name: string;
  
    description: string;
  
    imageUrl?: string;
  
    metadata: Record<string, any>;
  
    eventId: string;
  }