import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Put,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { updateFlavorDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { validatePresentation } from 'src/pipes/validatePresentation.pipe';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(validatePresentation)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() pagination?: PaginationQuery) {
    return this.productService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('relatedProducts/:id')
  relatedProducts(@Param('id', ParseUUIDPipe) productId: string) {
    return this.productService.relatedProducts(productId);
  }

  @Put('/addFlavor/:id')
  updateFlavor(
    @Param('id') id: string,
    @Body() updateFlavorDto: updateFlavorDto,
  ) {
    return this.productService.updateFlavor(id, updateFlavorDto);
  }

  @Put('/removeFlavor/:id')
  removeFlavor(
    @Param('id') id: string,
    @Body() updateFlavorDto: updateFlavorDto,
  ) {
    return this.productService.removeFlavor(id, updateFlavorDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
