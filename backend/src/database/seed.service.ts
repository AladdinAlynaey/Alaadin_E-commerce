import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Product } from '../modules/products/product.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('Category') private categoryModel: Model<any>,
    @InjectModel('Currency') private currencyModel: Model<any>,
    @InjectModel('ShippingZone') private shippingModel: Model<any>,
    @InjectModel(Product.name) private productModel: Model<any>,
    private configService: ConfigService,
  ) { }

  async onApplicationBootstrap() {
    await this.seedAdmin();
    await this.seedCategories();
    await this.seedShipping();
    await this.seedProducts();
  }

  private async seedAdmin() {
    const exists = await this.userModel.findOne({ role: 'superadmin' });
    if (exists) return;
    const hashed = await bcrypt.hash('admin123', 12);
    await this.userModel.create({
      email: 'admin@shop.greatapps.online ',
      password: hashed,
      name: { ar: 'المدير', en: 'Admin' },
      role: 'superadmin',
      isActive: true,
    });
    this.logger.log('✅ Super admin seeded: admin@shop.greatapps.online  / admin123');
  }

  private async seedCategories() {
    const count = await this.categoryModel.countDocuments();
    if (count > 0) return;
    const cats = [
      { name: { ar: 'رجال', en: 'Men' }, slug: { ar: 'رجال', en: 'men' }, icon: '👔', sortOrder: 1 },
      { name: { ar: 'نساء', en: 'Women' }, slug: { ar: 'نساء', en: 'women' }, icon: '👗', sortOrder: 2 },
      { name: { ar: 'أطفال', en: 'Kids' }, slug: { ar: 'اطفال', en: 'kids' }, icon: '🧒', sortOrder: 3 },
      { name: { ar: 'إكسسوارات', en: 'Accessories' }, slug: { ar: 'اكسسوارات', en: 'accessories' }, icon: '👜', sortOrder: 4 },
      { name: { ar: 'أحذية', en: 'Shoes' }, slug: { ar: 'احذية', en: 'shoes' }, icon: '👟', sortOrder: 5 },
    ];
    await this.categoryModel.insertMany(cats);
    this.logger.log('✅ Categories seeded');
  }

  private async seedShipping() {
    const count = await this.shippingModel.countDocuments();
    if (count > 0) return;
    const zones = [
      { name: { ar: 'صنعاء', en: 'Sanaa' }, cities: ['صنعاء', 'Sanaa'], fee: 500, currency: 'YER', estimatedDelivery: { ar: '1-2 أيام', en: '1-2 days' } },
      { name: { ar: 'عدن', en: 'Aden' }, cities: ['عدن', 'Aden'], fee: 1000, currency: 'YER', estimatedDelivery: { ar: '2-4 أيام', en: '2-4 days' } },
      { name: { ar: 'باقي المحافظات', en: 'Other' }, cities: ['تعز', 'حضرموت', 'إب', 'Taiz', 'Hadramaut', 'Ibb'], fee: 1500, currency: 'YER', estimatedDelivery: { ar: '3-5 أيام', en: '3-5 days' } },
    ];
    await this.shippingModel.insertMany(zones);
    this.logger.log('✅ Shipping zones seeded');
  }

  private async seedProducts() {
    const count = await this.productModel.countDocuments();

    const categories = await this.categoryModel.find();
    if (categories.length === 0) return;

    const productsMock = [
      {
        name: { ar: 'قميص رجالي رسمي كلاسيك', en: 'Classic Men\'s Formal Shirt' },
        description: { ar: 'قميص قطني 100% مناسب للمناسبات الرسمية والعمل.', en: '100% cotton shirt suitable for formal occasions and work.' },
        slug: { ar: 'قميص-رجالي-رسمي', en: 'classic-mens-formal-shirt' },
        price: { YER: 8000, SAR: 50, USD: 15 },
        categorySlug: 'men',
        isFeatured: true,
        isFlashDeal: false,
        totalStock: 50,
        ratings: { average: 4, count: 18 },
      },
      {
        name: { ar: 'جاكيت رجالي شتوي دافئ', en: 'Warm Men\'s Winter Jacket' },
        description: { ar: 'جاكيت شتوي أنيق ومقاوم للمياه للحماية من البرد.', en: 'Stylish waterproof winter jacket for cold weather protection.' },
        slug: { ar: 'جاكيت-رجالي-شتوي', en: 'warm-mens-winter-jacket' },
        price: { YER: 18000, SAR: 120, USD: 32 },
        categorySlug: 'men',
        isFeatured: true,
        isFlashDeal: true,
        flashDealEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalStock: 20,
        ratings: { average: 5, count: 25 },
      },
      {
        name: { ar: 'فستان سهرة نسائي أنيق', en: 'Elegant Women\'s Evening Dress' },
        description: { ar: 'فستان طويل وتصميم عصري مناسب للحفلات والمناسبات.', en: 'Long evening dress with a modern design suitable for parties and events.' },
        slug: { ar: 'فستان-سهرة-نسائي', en: 'elegant-womens-evening-dress' },
        price: { YER: 22000, SAR: 150, USD: 40 },
        categorySlug: 'women',
        isFeatured: true,
        isFlashDeal: false,
        totalStock: 15,
        ratings: { average: 5, count: 32 },
      },
      {
        name: { ar: 'حقيبة يد نسائية جلدية فاخرة', en: 'Luxury Women\'s Leather Handbag' },
        description: { ar: 'حقيبة يد من الجلد الطبيعي بتصميم راقي وعملي.', en: 'Natural leather handbag with a sophisticated and practical design.' },
        slug: { ar: 'حقيبة-يد-نسائية', en: 'luxury-womens-leather-handbag' },
        price: { YER: 15000, SAR: 95, USD: 25 },
        categorySlug: 'accessories',
        isFeatured: true,
        isFlashDeal: true,
        flashDealEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalStock: 30,
        ratings: { average: 4, count: 14 },
      },
      {
        name: { ar: 'حذاء رياضي مريح للجري', en: 'Comfortable Running Sports Shoes' },
        description: { ar: 'حذاء رياضي خفيف الوزن ومريح للمشي والركض الطويل.', en: 'Lightweight sports shoe comfortable for walking and long runs.' },
        slug: { ar: 'حذاء-رياضي-مريح', en: 'comfortable-running-sports-shoes' },
        price: { YER: 12000, SAR: 80, USD: 20 },
        categorySlug: 'shoes',
        isFeatured: false,
        isFlashDeal: false,
        totalStock: 100,
        ratings: { average: 4, count: 42 },
      },
      {
        name: { ar: 'طقم ملابس أطفال قطني قطعتين', en: 'Two-Piece Kids Cotton Clothing Set' },
        description: { ar: 'طقم مريح وناعم لحديثي الولادة والأطفال الصغار.', en: 'Comfortable and soft clothing set for newborns and toddlers.' },
        slug: { ar: 'طقم-ملابس-أطفال', en: 'two-piece-kids-cotton-clothing-set' },
        price: { YER: 6000, SAR: 40, USD: 10 },
        categorySlug: 'kids',
        isFeatured: false,
        isFlashDeal: false,
        totalStock: 60,
        ratings: { average: 5, count: 9 },
      }
    ];

    const mockImages: Record<string, string[]> = {
      'classic-mens-formal-shirt': ['/products/mens_formal_shirt.png'],
      'warm-mens-winter-jacket': ['/products/mens_winter_jacket.png'],
      'elegant-womens-evening-dress': ['/products/womens_evening_dress.png'],
      'luxury-womens-leather-handbag': ['/products/womens_leather_handbag.png'],
      'comfortable-running-sports-shoes': ['/products/running_shoes.png'],
      'two-piece-kids-cotton-clothing-set': ['/products/kids_clothing_set.png'],
    };

    const apiBaseUrl = this.configService.get('API_BASE_URL', 'http://localhost:5030/api');

    if (count === 0) {
      for (const p of productsMock) {
        const cat = categories.find(c => c.slug.en === p.categorySlug);
        if (cat) {
          const imgs = (mockImages[p.slug.en] || []).map(img => `${apiBaseUrl}/uploads${img}`);
          await this.productModel.create({
            name: p.name,
            description: p.description,
            slug: p.slug,
            price: p.price,
            category: cat._id,
            isFeatured: p.isFeatured,
            isFlashDeal: p.isFlashDeal,
            flashDealEnd: p.flashDealEnd,
            totalStock: p.totalStock,
            ratings: p.ratings,
            isActive: true,
            images: imgs,
            videos: [],
            variants: [],
            specifications: [],
          });
        }
      }
      this.logger.log('✅ Mock products seeded');
    } else {
      // Update existing products that do not have images
      for (const [slugEn, imgs] of Object.entries(mockImages)) {
        const fullImgs = imgs.map(img => `${apiBaseUrl}/uploads${img}`);
        await this.productModel.updateOne(
          { 'slug.en': slugEn, $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] },
          { $set: { images: fullImgs } }
        );
      }
      this.logger.log('✅ Updated existing products with image URLs');
    }
  }
}
