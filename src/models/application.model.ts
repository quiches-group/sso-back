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

  @Prop()
  publicKey?: string;

  @Prop()
  privateKey?: string;

  @Prop({ ref: 'User' })
  ownerRefs: Types.ObjectId[];
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);