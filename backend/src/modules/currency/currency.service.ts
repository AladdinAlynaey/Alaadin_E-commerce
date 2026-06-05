import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './currency.schema';
import { CurrencyCode } from '../../common/constants';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(@InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>) {}

  async onModuleInit() {
    const count = await this.currencyModel.countDocuments();
    if (count === 0) {
      await this.currencyModel.insertMany([
        { code: CurrencyCode.YER, name: { ar: 'ريال يمني', en: 'Yemeni Rial' }, symbol: '﷼', rate: 1, isDefault: true },
        { code: CurrencyCode.SAR, name: { ar: 'ريال سعودي', en: 'Saudi Riyal' }, symbol: 'ر.س', rate: 0.0067 },
        { code: CurrencyCode.USD, name: { ar: 'دولار أمريكي', en: 'US Dollar' }, symbol: '$', rate: 0.004 },
      ]);
    }
  }

  async findAll(): Promise<CurrencyDocument[]> {
    return this.currencyModel.find({ isActive: true });
  }

  async updateRate(code: string, rate: number) {
    const currency = await this.currencyModel.findOneAndUpdate({ code } as any, { rate }, { new: true });
    if (!currency) throw new NotFoundException('Currency not found');
    return currency;
  }

  async setDefault(code: string) {
    await this.currencyModel.updateMany({}, { isDefault: false });
    return this.currencyModel.findOneAndUpdate({ code } as any, { isDefault: true }, { new: true });
  }

  async convert(amount: number, from: CurrencyCode, to: CurrencyCode): Promise<number> {
    if (from === to) return amount;
    const [fromCurrency, toCurrency] = await Promise.all([
      this.currencyModel.findOne({ code: from }),
      this.currencyModel.findOne({ code: to }),
    ]);
    if (!fromCurrency || !toCurrency) throw new NotFoundException('Currency not found');
    const baseAmount = amount / fromCurrency.rate;
    return Math.round(baseAmount * toCurrency.rate * 100) / 100;
  }
}
