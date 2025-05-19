import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EventType {
  LOGIN = 'LOGIN',
  INVITE = 'INVITE',
  CUSTOM = 'CUSTOM',
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.ACTIVE })
  status: EventStatus;

  @Prop({ required: true })
  startDate: Date;
  
  @Prop({ required: true })
  endDate: Date;
  
  // 조건 만족 여부가 operator에 의해 결정되는 경우 -> pending
  // 조건 만족 여부가 시스템에 의해 결정되는 경우 -> approved or rejected
  @Prop({ required: true, default: false })
  needApproval: boolean;

  @Prop({ type: Object })
  conditions: Record<string, any>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reward' }] })
  rewards: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event); 
