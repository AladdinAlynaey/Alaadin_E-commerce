import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, productId: string, data: { rating: number; comment?: string }) {
    const existing = await this.reviewModel.findOne({ user: new Types.ObjectId(userId), product: new Types.ObjectId(productId) });
    if (existing) throw new ConflictException('You already reviewed this product');

    const review = await this.reviewModel.create({ user: userId, product: productId, ...data });
    await this.updateProductRating(productId);
    return review;
  }

  async findByProduct(productId: string, page = 1, limit = 10) {
    const filter = { product: new Types.ObjectId(productId), isApproved: true };
    const [data, total] = await Promise.all([
      this.reviewModel.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      this.reviewModel.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async moderate(id: string, isApproved: boolean) {
    const review = await this.reviewModel.findByIdAndUpdate(id, { isApproved }, { new: true });
    if (!review) throw new NotFoundException('Review not found');
    await this.updateProductRating(review.product.toString());
    return review;
  }

  private async updateProductRating(productId: string) {
    const result = await this.reviewModel.aggregate([
      { $match: { product: new Types.ObjectId(productId), isApproved: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const { average = 0, count = 0 } = result[0] || {};
    await this.productsService.updateRating(productId, Math.round(average * 10) / 10, count);
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.reviewModel.find().populate('user', 'name').populate('product', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      this.reviewModel.countDocuments(),
    ]);
    return { data, total, page, limit };
  }
}
