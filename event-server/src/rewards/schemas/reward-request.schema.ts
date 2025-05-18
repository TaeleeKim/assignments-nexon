import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RewardCategory } from './reward.schema';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reward', required: true })
  rewardId: Types.ObjectId;

  @Prop({ required: true, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Object })
  rewardData?: {
    category: RewardCategory;
    subType: string;
    name: string;
    description: string;
    metadata?: Record<string, any>;
  };

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;

  @Prop({ type: Object })
  responseData?: any;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest); 