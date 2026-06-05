import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../modules/users/user.schema';
import { Category, CategorySchema } from '../modules/categories/category.schema';
import { Currency, CurrencySchema } from '../modules/currency/currency.schema';
import { ShippingZone, ShippingZoneSchema } from '../modules/shipping/shipping-zone.schema';
import { Product, ProductSchema } from '../modules/products/product.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Currency.name, schema: CurrencySchema },
      { name: ShippingZone.name, schema: ShippingZoneSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
