import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, statusExp } from './entities/product.entity';
import { LessThan, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Flavor } from 'src/flavor/entities/flavor.entity';
import { Category } from 'src/category/entity/category.entity';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Flavor) private flavorRepository: Repository<Flavor>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(OrderDetailProduct)
    private readonly orderDetailProductRepository: Repository<OrderDetailProduct>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!findCategory)
      throw new NotFoundException(
        `Category ${createProductDto.categoryId} not found`,
      );

    const imageEntities = createProductDto.images.map((imageUrl) =>
      this.imageRepository.create({ img: imageUrl }),
    );
    const savedImages = await this.imageRepository.save(imageEntities);
    const { categoryId, ...saveProduct } = createProductDto;

    // Manejar la creación de los sabores
    const flavorEntities = createProductDto.flavors.map((flavor) => ({
      id: flavor.id,
      name: flavor.name,
      stock: flavor.stock,
    }));

    const newProduct = {
      ...saveProduct,
      category: findCategory,
      images: savedImages,
      flavors: flavorEntities,
    };

    return await this.productRepository.save(newProduct);
  }

  async findAll(pagination?: PaginationQuery) {
    const defaultPage = pagination?.page || 1;
    const defaultLimit = pagination?.limit || 15;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const products = await this.productRepository.find({
      relations: { flavors: true, images: true,category: true },
    });
    const sliceUsers = products.slice(startIndex, endIndex);
    return sliceUsers;
  }

  async findOne(id: string) {
    const findProdut = await this.productRepository.findOne({
      where: { id: id },
      relations: ['flavors', 'images','category'],
    });
    if (!findProdut) throw new NotFoundException('Product not found');

    return findProdut;
  }

  async updateFlavor(id: string, updateFlavorDto) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { flavors: true },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    const existingFlavors = findProduct.flavors.map((flavor) => flavor.name);
    const flavorsToAdd = updateFlavorDto.flavor.filter(
      (flavor) => !existingFlavors.includes(flavor),
    );
    if (flavorsToAdd.length > 0) {
      const flavorsToAddEntities = flavorsToAdd.map((name) => ({ name: name }));
      await this.flavorRepository.save(flavorsToAddEntities);
      findProduct.flavors = [...findProduct.flavors, ...flavorsToAddEntities];
      await this.productRepository.save(findProduct);
    }

    return findProduct;
  }

  async removeFlavor(id: string, updateFlavorDto) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { flavors: true },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    const flavorsToRemove = findProduct.flavors.filter((flavor) =>
      updateFlavorDto.flavor.includes(flavor.name),
    );

    if (flavorsToRemove.length > 0) {
      await this.flavorRepository.remove(flavorsToRemove);
      findProduct.flavors = findProduct.flavors.filter(
        (flavor) => !flavorsToRemove.includes(flavor),
      );
    }
    await this.productRepository.save(findProduct);
    return findProduct;
  }

  async inactiveProduct(id: string) {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: { flavors: true },
    });
    if (!findProduct) throw new NotFoundException('Product not found');

    await this.productRepository.update(findProduct.id, {
      isActive: false,
    });
    return `Product ${id} change to inactive`;
  }
  async remove(id: string): Promise<string> {
    const findProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['orderDetailProducts', 'images', 'flavors'],
    });

    if (!findProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Elimina las relaciones con OrderDetailProducts si existen
    if (findProduct.orderDetailProducts?.length > 0) {
      await this.orderDetailProductRepository.remove(
        findProduct.orderDetailProducts,
      );
    }

    // Elimina las imágenes si existen
    if (findProduct.images?.length > 0) {
      await this.imageRepository.remove(findProduct.images);
    }

    // Elimina el producto
    await this.productRepository.remove(findProduct);

    return `Se ha eliminado el producto correspondiente`;
  }

  async update(id, updateProductDto) {
    const product = await this.productRepository.findOne({ where: { id: id } });
    if (!product) throw new NotFoundException(`Product not foun`, id);

    await this.productRepository.update(id, { ...updateProductDto });

    return 'Product updated';
  }

  async findExpiredProducts() {
    const now = new Date();
    return this.productRepository.find({
      where: {
        expiryDate: LessThan(now),
        status: statusExp.ACTIVATED,
      },
    });
  }

  async updateProductStatus(
    productId: string,
    status: statusExp,
  ): Promise<void> {
    await this.productRepository.update(productId, { status });
  }

  @Cron('0 0 * * *')
  async handleCron() {
    const expiredProducts = await this.findExpiredProducts();

    for (const product of expiredProducts) {
      await this.updateProductStatus(product.id, statusExp.EXPIRED);
    }
  }
}
