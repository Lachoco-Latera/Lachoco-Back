import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Flavor } from './entities/sabor.entity';
import { fnPagination } from 'src/utils/pagination';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(Flavor) private flavorRepository: Repository<Flavor>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const imageEntities = createProductDto.images.map((imageUrl) =>
      this.imageRepository.create({ img: imageUrl }),
    );
    const flavorEntities = createProductDto.flavors.map((flavor) =>
      this.flavorRepository.create({ name: flavor }),
    );

    const savedImages = await this.imageRepository.save(imageEntities);
    const savedFlavors = await this.flavorRepository.save(flavorEntities);

    const newProduct = {
      ...createProductDto,
      images: savedImages,
      flavors: savedFlavors,
    };

    return await this.productRepository.save(newProduct);
  }

  async findAll(pagination) {
    const { page, limit } = pagination ?? {};
    const defaultPage = page ?? 1;
    const defaultLimit = limit ?? 15;

    const startIndex = (defaultPage - 1) * defaultLimit;
    const endIndex = startIndex + defaultLimit;

    const products = await this.productRepository.find({
      relations: { flavors: true, images: true },
    });
    const sliceUsers = products.slice(startIndex, endIndex);
    return sliceUsers;
  }

  async findOne(id: string) {
    const findProdut = await this.productRepository.findOne({
      where: { id: id },
      relations: ['flavors', 'images'],
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
}
