import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(categoryName: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (findCategory) throw new ConflictException('Category already exists');

    const saveCategory = await this.categoryRepository.save({
      name: categoryName,
    });
    return saveCategory;
  }

  async findAllCategories() {
    const allCategories = await this.categoryRepository.find();
    return allCategories;
  }

  async updateCategory(id: string, icon: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) throw new NotFoundException('Category not found');

    category.icon = icon; // Actualiza el icono de la categoría
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) throw new NotFoundException('Category not found');

    await this.categoryRepository.remove(findCategory);
    return `Category ${findCategory.id} deleted`;
  }
}
