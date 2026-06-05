import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) })
      .populate('items.product', 'name price images variants totalStock')
      .populate('savedForLater.product', 'name price images');
    if (!cart) cart = await this.cartModel.create({ user: userId, items: [] });
    return cart;
  }

  async addItem(userId: string, item: { product: string; variant?: any; quantity?: number }) {
    let cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (!cart) cart = await this.cartModel.create({ user: userId, items: [] });

    const existingIndex = cart.items.findIndex(
      i => i.product.toString() === item.product &&
        JSON.stringify(i.variant) === JSON.stringify(item.variant || {})
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += (item.quantity || 1);
    } else {
      cart.items.push({
        product: new Types.ObjectId(item.product),
        variant: item.variant || {},
        quantity: item.quantity || 1,
      } as any);
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateQuantity(userId: string, itemIndex: number, quantity: number) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (cart && cart.items[itemIndex]) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
    }
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemIndex: number) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (cart) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
    }
    return this.getCart(userId);
  }

  async saveForLater(userId: string, itemIndex: number) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (cart && cart.items[itemIndex]) {
      const item = cart.items.splice(itemIndex, 1)[0];
      cart.savedForLater.push({ product: item.product, variant: item.variant } as any);
      await cart.save();
    }
    return this.getCart(userId);
  }

  async moveToCart(userId: string, savedIndex: number) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) });
    if (cart && cart.savedForLater[savedIndex]) {
      const item = cart.savedForLater.splice(savedIndex, 1)[0];
      cart.items.push({ ...item, quantity: 1 } as any);
      await cart.save();
    }
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartModel.findOneAndUpdate({ user: new Types.ObjectId(userId) }, { items: [] });
  }
}
