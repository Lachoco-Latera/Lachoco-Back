import { IsEnum, IsNotEmpty } from 'class-validator';
import { category } from '../entity/category.entity';
import { CategoryIcon } from '../entity/category.entity';

export class CategoryName {
  @IsEnum(category)
  @IsNotEmpty()
  name: category;

  @IsEnum(CategoryIcon)
  @IsNotEmpty()
  icon: CategoryIcon;
}
