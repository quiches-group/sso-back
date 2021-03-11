import {
    Schema, Types, Document, Model, model,
} from 'mongoose';

const ApplicationUserSchema = new Schema({
    mail: { type: 'string', required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    password: { type: 'string', select: false, required: true },
    firstname: { type: 'string', required: true },
    lastname: { type: 'string', required: true },
    registrationDate: { type: 'number' },
    isActive: { type: 'boolean', default: false },
    activationKey: { type: 'string' },
    __v: { type: Number, select: false },
});

export interface ApplicationUser extends Document {
  _id: Types.ObjectId;
  mail: string;
  applicationId: Types.ObjectId;
  password: string;
  firstname?: string;
  lastname?: string;
  registrationDate?: number;
  isActive: boolean;
  activationKey?: string;
}

export const ApplicationUserModel: Model<ApplicationUser> = model<ApplicationUser>('ApplicationUser', ApplicationUserSchema);
