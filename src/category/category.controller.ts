import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryName } from './dto/category.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.findAllCategories();
  }

  @Post()
  addCategory(@Body() nameCategory: CategoryName) {
    return this.categoryService.createCategory(nameCategory.name);
  }

  @Put(':id')
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: { icon: string },
  ) {
    return this.categoryService.updateCategory(id, updateData.icon);
  }

  @Delete(':id')
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
