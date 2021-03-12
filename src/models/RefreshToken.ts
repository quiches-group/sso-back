import {
    Schema, Document, Model, model, Types,
} from 'mongoose';

const refreshTokenSchema = new Schema({
    token: { type: 'string', unique: true, required: true },
    expirationDate: { type: 'number', required: true },
    active: { type: 'boolean', required: true, default: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    applicationUserId: { type: Schema.Types.ObjectId, ref: 'ApplicationUser' },
    __v: { type: Number, select: false },
});

export interface RefreshToken extends Document {
  _id: string;
  token: string;
  expirationDate: number;
  userId: Types.ObjectId;
  applicationUserId: Types.ObjectId;
  active: boolean;
}

export const RefreshTokenModel: Model<RefreshToken> = model<RefreshToken>('RefreshToken', refreshTokenSchema);
