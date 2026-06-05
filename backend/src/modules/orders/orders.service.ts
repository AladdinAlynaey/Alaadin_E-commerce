import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderDocument } from './order.schema';
import { Product } from '../products/product.schema';
import { CartService } from '../cart/cart.service';
import { OrderStatus, PaymentStatus } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<any>,
    private cartService: CartService,
    private eventEmitter: EventEmitter2,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  async create(userId: string, data: {
    shippingAddress: any;
    currency?: string;
    couponCode?: string;
    notes?: string;
    items: any[];
    subtotal: number;
    shippingFee?: number;
    discount?: number;
    total: number;
  }) {
    const order = await this.orderModel.create({
      orderNumber: this.generateOrderNumber(),
      user: new Types.ObjectId(userId),
      ...data,
    });

    await this.cartService.clearCart(userId);
    this.eventEmitter.emit('order.created', { order, userId });
    return order;
  }

  async findByUser(userId: string, query: PaginationDto) {
    const { page = 1, limit = 10, sortOrder = 'desc' } = query;
    const filter = { user: new Types.ObjectId(userId) };
    const [data, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: sortOrder === 'asc' ? 1 : -1 }).skip((page - 1) * limit).limit(limit),
      this.orderModel.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).populate('user', 'name email phone');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ orderNumber }).populate('user', 'name email phone');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    if (!order) throw new NotFoundException('Order not found');
    this.eventEmitter.emit('order.statusUpdated', { order, status });
    return order;
  }

  private async deductStock(order: OrderDocument) {
    for (const item of order.items) {
      const product = await this.productModel.findById(item.product);
      if (!product) continue;

      const quantity = item.quantity || 0;
      let totalStock = product.totalStock || 0;
      totalStock = Math.max(0, totalStock - quantity);
      
      const soldCount = (product.soldCount || 0) + quantity;

      // Update variant stock if variant info is matching
      let variants = product.variants || [];
      if (item.variant && (item.variant.size || item.variant.color)) {
        variants = variants.map((v: any) => {
          const sizeMatch = !item.variant.size || v.size === item.variant.size;
          const colorMatch = !item.variant.color || v.color?.name?.ar === item.variant.color || v.color?.name?.en === item.variant.color;
          if (sizeMatch && colorMatch) {
            return {
              ...v,
              stock: Math.max(0, (v.stock || 0) - quantity),
            };
          }
          return v;
        });
      }

      await this.productModel.findByIdAndUpdate(item.product, {
        totalStock,
        soldCount,
        variants,
      });
    }
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const update: any = { paymentStatus };
    if (paymentStatus === PaymentStatus.APPROVED) {
      update.orderStatus = OrderStatus.PAYMENT_APPROVED;
    }
    const order = await this.orderModel.findByIdAndUpdate(id, update, { new: true });
    if (!order) throw new NotFoundException('Order not found');

    if (paymentStatus === PaymentStatus.APPROVED) {
      await this.deductStock(order);
    }

    this.eventEmitter.emit('order.paymentUpdated', { order, paymentStatus });
    return order;
  }

  async uploadPaymentProof(id: string, proofPath: string) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { paymentProof: proofPath, paymentStatus: PaymentStatus.UPLOADED, orderStatus: OrderStatus.PAYMENT_UPLOADED },
      { new: true },
    );
    if (!order) throw new NotFoundException('Order not found');
    this.eventEmitter.emit('order.paymentProofUploaded', { order });
    return order;
  }

  async findAll(query: PaginationDto & { status?: string; paymentStatus?: string }) {
    const { page = 1, limit = 20, sortOrder = 'desc', status, paymentStatus, search } = query;
    const filter: any = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const [data, total] = await Promise.all([
      this.orderModel.find(filter).populate('user', 'name email').sort({ createdAt: sortOrder === 'asc' ? 1 : -1 }).skip((page - 1) * limit).limit(limit),
      this.orderModel.countDocuments(filter),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getStats() {
    const [total, pending, processing, delivered, revenue] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ orderStatus: OrderStatus.PENDING }),
      this.orderModel.countDocuments({ orderStatus: OrderStatus.PROCESSING }),
      this.orderModel.countDocuments({ orderStatus: OrderStatus.DELIVERED }),
      this.orderModel.aggregate([
        { $match: { paymentStatus: PaymentStatus.APPROVED } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    return { total, pending, processing, delivered, revenue: revenue[0]?.total || 0 };
  }

  async getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly' = 'daily', days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const groupBy = period === 'daily'
      ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      : period === 'weekly'
        ? { $dateToString: { format: '%Y-W%V', date: '$createdAt' } }
        : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

    return this.orderModel.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: PaymentStatus.APPROVED } },
      { $group: { _id: groupBy, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }
}
