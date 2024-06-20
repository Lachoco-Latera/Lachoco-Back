import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Flavor } from './entities/sabor.entity';
export declare class ProductService {
    private productRepository;
    private imageRepository;
    private flavorRepository;
    constructor(productRepository: Repository<Product>, imageRepository: Repository<Image>, flavorRepository: Repository<Flavor>);
    create(createProductDto: any): Promise<any>;
    findAll(pagination: any): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    updateFlavor(id: string, updateFlavorDto: any): Promise<Product>;
    removeFlavor(id: string, updateFlavorDto: any): Promise<Product>;
    inactiveProduct(id: string): Promise<string>;
}
