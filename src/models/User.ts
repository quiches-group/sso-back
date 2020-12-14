import {
    Schema, Types, Document, Model, model,
} from 'mongoose';

const UserSchema = new Schema({
    mail: { type: 'string', unique: true, required: true },
    password: { type: 'string', select: false, required: true },
    firstname: { type: 'string', required: true },
    lastname: { type: 'string', required: true },
    registrationDate: { type: 'number' },
    isActive: { type: 'boolean', default: false },
    isAdmin: { type: 'boolean', default: false },
    activationKey: { type: 'string' },
    applicationsRefs: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
    __v: { type: Number, select: false },
});

export interface User extends Document {
  _id: Types.ObjectId;
  mail: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  registrationDate?: number;
  active: boolean;
  isAdmin: boolean;
  activationKey?: string;
  applications: Types.ObjectId[];
}

export const UserModel: Model<User> = model<User>('User', UserSchema);
