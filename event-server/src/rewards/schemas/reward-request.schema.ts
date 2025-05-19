import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RewardCategory } from './reward.schema';

export type RewardRequestDocument = RewardRequest & Document;

export enum RewardRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  // pending은 operator approval 이 필요한 상태
  @Prop({ required: true, enum: RewardRequestStatus, default: RewardRequestStatus.PENDING })
  status: RewardRequestStatus;

  @Prop({ type: Array, required: true })
  history: [{
    requestAt: Date;
    status: RewardRequestStatus;
    conditionStatus: {
      [key: string]: {
        required: any;
        actual: any;
        isMet: boolean;
      };
    };
  }];

  @Prop({ type: Object })
  approvedData?: {
    approvedAt: Date;
    approvedBy: Types.ObjectId | null; // null일 경우 시스템 체크
  }

  @Prop({ type: Object })
  rejectedData?: {
    rejectedAt: Date;
    rejectedBy: Types.ObjectId | null; // null일 경우 시스템 체크
    rejectionReason: string;
  }
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest); 