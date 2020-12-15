import {
    Schema, Document, Model, model, Types,
} from 'mongoose';

const ApplicationSchema = new Schema({
    name: { type: 'string', unique: true, required: true },
    slug: { type: 'string', unique: true },
    ownerRefs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    callbackUrls: { type: 'array', default: [] },
    __v: { type: Number, select: false },
});

export interface Application extends Document {
  _id: Types.ObjectId;
  name: string;
  slug?: string;
  ownersIds: Types.ObjectId[];
  ownerRefs: Types.ObjectId[];
  callbackUrls: string[];
}

export const ApplicationModel: Model<Application> = model<Application>('Application', ApplicationSchema);
