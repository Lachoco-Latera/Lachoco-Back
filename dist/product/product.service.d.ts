import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Flavor } from './entities/sabor.entity';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductService {
    private productRepository;
    private imageRepository;
    private flavorRepository;
    constructor(productRepository: Repository<Product>, imageRepository: Repository<Image>, flavorRepository: Repository<Flavor>);
    create(createProductDto: CreateProductDto): Promise<{
        images: Image[];
        flavors: (Flavor & Image)[];
        category: import("./entities/product.entity").category;
        description: string;
        price: number;
        stock: number;
        label: import("./entities/product.entity").label;
        presentacion: number;
    } & Product>;
    findAll(pagination: any): Promise<any>;
    findOne(id: string): Promise<Product>;
    updateFlavor(id: string, updateFlavorDto: any): Promise<Product>;
    removeFlavor(id: string, updateFlavorDto: any): Promise<Product>;
    inactiveProduct(id: string): Promise<string>;
}
