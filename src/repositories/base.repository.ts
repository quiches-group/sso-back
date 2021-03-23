/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Document,
  FilterQuery as MongooseFilterQuery,
  Model,
  Types,
} from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

class BaseRepository<T extends Document> {
  private readonly Model: Model<T>;

  constructor(model: Model<T>) {
    this.Model = model;
  }

  async insert(data: FilterQuery<T>): Promise<T> {
    try {
      const newObject = new this.Model(data);
      await newObject.validate();

      return await newObject.save();
    } catch (e) {
      const requiredErrorKeys = Object.keys(e.errors).filter(
        (key) => e.errors[key].kind === 'required',
      );

      if (requiredErrorKeys.length) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'MISSING_REQUIRED_FIELDS',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'UNKNOWN_ERROR',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneBy(
    condition: FilterQuery<T>,
    hiddenPropertiesToSelect: HiddenPropertyType = [],
  ): Promise<T | null> {
    try {
      const finedObject = await this.Model.findOne(condition).select(
        hiddenPropertiesToSelect.map((property) => `+${property}`).join(' '),
      );

      return finedObject || null;
    } catch (e) {
      return null;
    }
  }

  async findOneById(
    _id: string,
    hiddenPropertiesToSelect: HiddenPropertyType = [],
  ): Promise<T | null> {
    // @ts-ignore
    return this.findOneBy({ _id }, hiddenPropertiesToSelect);
  }

  async deleteOnyBy(condition: FilterQuery<T>): Promise<boolean> {
    try {
      return (await this.Model.deleteOne(condition)).deletedCount > 0;
    } catch {
      return false;
    }
  }

  async updateOneBy(
    condition: FilterQuery<T>,
    set: DataType,
  ): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...data } = set;
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $set: data,
        $inc: { __v: 1 },
      });
      return update.nModified > 0;
    } catch {
      return false;
    }
  }

  async findManyBy(
    condition: FilterQuery<T>,
    hiddenPropertiesToSelect: HiddenPropertyType = [],
  ): Promise<T[]> {
    try {
      // @ts-ignore
      return this.Model.find(condition).select(
        hiddenPropertiesToSelect.map((property) => `+${property}`).join(' '),
      );
    } catch {
      return [];
    }
  }

  async findAll(
    hiddenPropertiesToSelect: HiddenPropertyType = [],
  ): Promise<T[]> {
    return this.findManyBy({}, hiddenPropertiesToSelect);
  }

  async pushArray(condition: FilterQuery<T>, data: DataType): Promise<boolean> {
    try {
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $push: data,
        $inc: { __v: 1 },
      });
      return update.nModified > 0;
    } catch {
      return false;
    }
  }

  async pullArray(condition: FilterQuery<T>, data: DataType): Promise<boolean> {
    try {
      // @ts-ignore
      const update = await this.Model.updateOne(condition, {
        $pull: data,
        $inc: { __v: 1 },
      });
      return update.nModified > 0;
    } catch {
      return false;
    }
  }
}

export type FilterQuery<T> = MongooseFilterQuery<T>;
export type DataType = Record<
  string,
  number | string | boolean | null | Types.ObjectId | any[]
>;
export type HiddenPropertyType = Array<string>;

export default BaseRepository;
