import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(data: Partial<Product>): Promise<ProductDocument> {
    const totalStock = data.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
    return this.productModel.create({ ...data, totalStock });
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string, lang: string = 'en'): Promise<ProductDocument> {
    const key = lang === 'ar' ? 'slug.ar' : 'slug.en';
    const product = await this.productModel.findOne({ [key]: slug }).populate('category');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAll(query: PaginationDto & {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    rating?: number;
    featured?: boolean;
    flashDeal?: boolean;
    currency?: string;
  }) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search,
      category, minPrice, maxPrice, size, color, rating, featured, flashDeal, currency = 'YER' } = query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = new Types.ObjectId(category);
    if (minPrice !== undefined) filter[`price.${currency}`] = { ...filter[`price.${currency}`], $gte: minPrice };
    if (maxPrice !== undefined) filter[`price.${currency}`] = { ...filter[`price.${currency}`], $lte: maxPrice };
    if (size) filter['variants.size'] = size;
    if (color) filter['variants.color.hex'] = color;
    if (rating) filter['ratings.average'] = { $gte: rating };
    if (featured) filter.isFeatured = true;
    if (flashDeal) {
      filter.isFlashDeal = true;
      filter.flashDealEnd = { $gt: new Date() };
    }

    let sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    if (sortBy === 'price') sort = { [`price.${currency}`]: sortOrder === 'asc' ? 1 : -1 };
    if (sortBy === 'bestSelling') sort = { soldCount: -1 };

    const [data, total] = await Promise.all([
      this.productModel.find(filter).populate('category').sort(sort).skip((page - 1) * limit).limit(limit),
      this.productModel.countDocuments(filter),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, data: Partial<Product>): Promise<ProductDocument> {
    if (data.variants) {
      (data as any).totalStock = data.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
    const product = await this.productModel.findByIdAndUpdate(id, data, { new: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Product not found');
  }

  async getFeatured(limit: number = 8): Promise<ProductDocument[]> {
    return this.productModel.find({ isActive: true, isFeatured: true }).populate('category').limit(limit);
  }

  async getFlashDeals(limit: number = 8): Promise<ProductDocument[]> {
    return this.productModel.find({
      isActive: true, isFlashDeal: true, flashDealEnd: { $gt: new Date() },
    }).populate('category').limit(limit);
  }

  async getBestSelling(limit: number = 8): Promise<ProductDocument[]> {
    return this.productModel.find({ isActive: true }).populate('category').sort({ soldCount: -1 }).limit(limit);
  }

  async getRelated(productId: string, limit: number = 8): Promise<ProductDocument[]> {
    const product = await this.findById(productId);
    return this.productModel.find({
      _id: { $ne: product._id }, category: product.category, isActive: true,
    }).limit(limit);
  }

  async updateRating(productId: string, average: number, count: number) {
    await this.productModel.findByIdAndUpdate(productId, { ratings: { average, count } });
  }

  async getStats() {
    const [total, active, outOfStock] = await Promise.all([
      this.productModel.countDocuments(),
      this.productModel.countDocuments({ isActive: true }),
      this.productModel.countDocuments({ totalStock: 0 }),
    ]);
    return { total, active, outOfStock };
  }

  async search(query: string, limit: number = 10) {
    return this.productModel.find(
      { $text: { $search: query }, isActive: true },
      { score: { $meta: 'textScore' } },
    ).sort({ score: { $meta: 'textScore' } }).limit(limit).populate('category');
  }
}
