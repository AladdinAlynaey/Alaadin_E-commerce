import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async get(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ user: new Types.ObjectId(userId) })
      .populate('products', 'name price images ratings');
    if (!wishlist) wishlist = await this.wishlistModel.create({ user: userId, products: [] });
    return wishlist;
  }

  async toggle(userId: string, productId: string) {
    let wishlist = await this.wishlistModel.findOne({ user: new Types.ObjectId(userId) });
    if (!wishlist) wishlist = await this.wishlistModel.create({ user: userId, products: [] });

    const index = wishlist.products.findIndex(p => p.toString() === productId);
    if (index >= 0) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(new Types.ObjectId(productId));
    }
    await wishlist.save();
    return this.get(userId);
  }

  async remove(userId: string, productId: string) {
    await this.wishlistModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $pull: { products: new Types.ObjectId(productId) } },
    );
    return this.get(userId);
  }
}
