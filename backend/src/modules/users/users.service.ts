import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { UserRole } from '../../common/constants';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).select('+password');
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search } = query;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.userModel.countDocuments(filter),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    await this.userModel.findByIdAndUpdate(id, { refreshToken });
  }

  async updatePreferences(id: string, preferences: Partial<User['preferences']>) {
    return this.userModel.findByIdAndUpdate(
      id,
      { $set: { preferences } },
      { new: true },
    );
  }

  async addAddress(id: string, address: any) {
    return this.userModel.findByIdAndUpdate(
      id,
      { $push: { addresses: address } },
      { new: true },
    );
  }

  async removeAddress(userId: string, addressIndex: number) {
    const user = await this.findById(userId);
    user.addresses.splice(addressIndex, 1);
    return user.save();
  }

  async getStats() {
    const [total, active, admins] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({ role: { $in: [UserRole.ADMIN, UserRole.SUPERADMIN] } } as any),
    ]);
    return { total, active, admins };
  }

  async findByVerificationToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailVerificationToken: token } as any);
  }

  async markEmailVerified(id: string) {
    return this.userModel.findByIdAndUpdate(id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });
  }

  async updateVerificationToken(id: string, token: string, expires: Date) {
    return this.userModel.findByIdAndUpdate(id, {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    });
  }

  async findByPasswordResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ passwordResetToken: token } as any);
  }

  async updatePasswordResetToken(id: string, token: string, expires: Date) {
    return this.userModel.findByIdAndUpdate(id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Incorrect current password');

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }
}
