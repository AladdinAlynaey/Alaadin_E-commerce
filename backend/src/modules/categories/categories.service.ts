import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(data: Partial<Category>): Promise<CategoryDocument> {
    return this.categoryModel.create(data);
  }

  async findAll(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return this.categoryModel.find(filter).populate('parent').sort({ order: 1 });
  }

  async findById(id: string): Promise<CategoryDocument> {
    const cat = await this.categoryModel.findById(id).populate('parent');
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async getTree() {
    const categories = await this.categoryModel.find({ isActive: true }).sort({ order: 1 }).lean();
    return this.buildTree(categories);
  }

  private buildTree(categories: any[], parentId: any = null): any[] {
    return categories
      .filter(c => String(c.parent) === String(parentId) || (!c.parent && !parentId))
      .map(c => ({ ...c, children: this.buildTree(categories, c._id) }));
  }

  async update(id: string, data: Partial<Category>): Promise<CategoryDocument> {
    const cat = await this.categoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async delete(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id);
    await this.categoryModel.updateMany({ parent: id }, { parent: null });
  }

  async getFlatTree(includeInactive = false): Promise<any[]> {
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await this.categoryModel.find(filter).populate('parent').sort({ order: 1 }).lean();
    return this.flattenCategories(categories);
  }

  private flattenCategories(categories: any[], parentId: any = null, depth = 0): any[] {
    let result: any[] = [];
    const level = categories.filter(c => {
      const pId = c.parent?._id || c.parent;
      return String(pId || '') === String(parentId || '');
    });

    for (const cat of level) {
      result.push({ ...cat, depth });
      result = result.concat(this.flattenCategories(categories, cat._id, depth + 1));
    }
    return result;
  }

  async getDescendantIds(categoryId: string): Promise<string[]> {
    const categories = await this.categoryModel.find({ isActive: true }).lean();
    const ids: string[] = [categoryId];

    const findChildren = (parentId: string) => {
      for (const cat of categories) {
        const pId = cat.parent?._id || cat.parent;
        if (pId && String(pId) === String(parentId)) {
          const childIdStr = String(cat._id);
          if (!ids.includes(childIdStr)) {
            ids.push(childIdStr);
            findChildren(childIdStr);
          }
        }
      }
    };

    findChildren(categoryId);
    return ids;
  }
}
