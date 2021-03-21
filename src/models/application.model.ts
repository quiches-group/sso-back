import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  slug: string;

  @Prop({ select: false })
  publicKey?: string;

  @Prop({ select: false })
  privateKey?: string;

  @Prop({ ref: 'User', select: false })
  ownerRefs: Types.ObjectId[];
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
