import {
    Document, FilterQuery as MongooseFilterQuery,
    Model, Types,
} from 'mongoose';
import ApiError from '../errors/ApiError';

class BaseRepository<T extends Document> {
    private readonly Model: Model<T>;

    constructor(model: Model<T>) {
        this.Model = model;
    }

    async saveData(data: FilterQuery<T>): Promise<T> {
        try {
            const newObject = new this.Model(data);
            await newObject.validate();

            return await newObject.save();
        } catch (e) {
            const requiredErrorKeys = Object.keys(e.errors).filter((key) => e.errors[key].kind === 'required');

            if (requiredErrorKeys.length) {
                throw new ApiError('MISSING_REQUIRED_FIELDS');
            }

            throw new ApiError('UNKNOWN_ERROR');
        }
    }

    async findOneBy(condition: FilterQuery<T>, hiddenPropertiesToSelect: HiddenPropertyType = []): Promise<T | null> {
        try {
            // @ts-ignore
            const finedObject = await this.Model.findOne(condition)
                .select(hiddenPropertiesToSelect.map((property) => `+${property}`).join(' '));

            return finedObject || null;
        } catch (e) {
            return null;
        }
    }

    async findOneById(_id: string, hiddenPropertiesToSelect: HiddenPropertyType = []): Promise<T | null> {
        // @ts-ignore
        return this.findOneBy({ _id }, hiddenPropertiesToSelect);
    }

    async deleteOnyBy(condition: FilterQuery<T>): Promise<boolean> {
        try {
            // @ts-ignore
            const deletion = await this.Model.deleteOne(condition);
            return deletion.deletedCount! > 0;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
            return false;
        }
    }

    async updateOneBy(condition: FilterQuery<T>, set: DataType): Promise<boolean> {
        try {
            const { _id, ...data } = set;
            // @ts-ignore
            const update = await this.Model.updateOne(condition, { $set: data, $inc: { __v: 1 } });
            return update.nModified > 0;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async findManyBy(condition: FilterQuery<T>, hiddenPropertiesToSelect: HiddenPropertyType = []): Promise<T[]> {
        try {
            // @ts-ignore
            return this.Model.find(condition)
                .select(hiddenPropertiesToSelect.join('+'));
        } catch (e) {
            return [];
        }
    }
}

export type FilterQuery<T> = MongooseFilterQuery<T>;
export type DataType = Record<string, number | string | boolean | null | Types.ObjectId | any[]>;
export type HiddenPropertyType = Array<string>;

export default BaseRepository;
