import {
    Schema, Document, Model, model, Types,
} from 'mongoose';

const ApplicationSchema = new Schema({
    name: { type: 'string', unique: true, required: true },
    slug: { type: 'string', unique: true },
    ownerRefs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    publicKey: { type: 'string', select: false },
    privateKey: { type: 'string', select: false },
    __v: { type: Number, select: false },
});

export interface Application extends Document {
  _id: Types.ObjectId;
  name: string;
  slug?: string;
  publicKey?: string,
  privateKey?: string,
  ownerRefs: Types.ObjectId[];
}

export interface PublicApplication {
    name: string
}

export const ApplicationModel: Model<Application> = model<Application>('Application', ApplicationSchema);
