import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationUserDocument = ApplicationUser & Document;

@Schema()
export class ApplicationUser {
  _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  mail: string;

  @Prop({ ref: 'Application', required: true })
  applicationId: string;

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

  @Prop()
  activationKey?: string;
}

export const ApplicationUserSchema = SchemaFactory.createForClass(
  ApplicationUser,
);
