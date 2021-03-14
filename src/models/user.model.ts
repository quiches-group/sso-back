import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  mail: string;

  @Prop({ select: false, required: true })
  password: string;

  @Prop({ required: true })
  firstname?: string;

  @Prop({ required: true })
  lastname?: string;

  @Prop()
  registrationDate?: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  activationKey?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
