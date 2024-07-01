import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, CategoryIcon } from './entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(categoryName: string, categoryIcon?: CategoryIcon) {
    const findCategory = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (findCategory) throw new ConflictException('Category already exists');

    const saveCategory = await this.categoryRepository.save({
      name: categoryName,
      icon: categoryIcon, 
    });
    return saveCategory;
  }

  async findAllCategories() {
    const allCategories = await this.categoryRepository.find();
    return allCategories;
  }

  async deleteCategory(id: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new ConflictException('Category already exists');

    await this.categoryRepository.remove(findCategory);
    return `Category ${findCategory.id} deleted`;
  }
}
