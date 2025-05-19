import {
  PointsRewardDto,
  ItemRewardDto,
  CouponRewardDto,
  CurrencyRewardDto,
  ExperienceRewardDto
} from './category-rewards.dto';

export type CreateRewardDto =
  | PointsRewardDto
  | ItemRewardDto
  | CouponRewardDto
  | CurrencyRewardDto
  | ExperienceRewardDto;  

export const REWARD_DTOS = {
  POINTS: PointsRewardDto,
  ITEM: ItemRewardDto,
  COUPON: CouponRewardDto,
  CURRENCY: CurrencyRewardDto,
  EXPERIENCE: ExperienceRewardDto,
} as const;
