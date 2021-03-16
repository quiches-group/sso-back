import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
  _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  token: string;

  @Prop({ required: true })
  expirationDate: number;

  @Prop({ ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ ref: 'ApplicationUser' })
  applicationUserId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  active: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
