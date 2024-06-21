import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Flavor } from 'src/flavor/entities/flavor.entity';
export declare class ProductService {
    private productRepository;
    private imageRepository;
    private flavorRepository;
    constructor(productRepository: Repository<Product>, imageRepository: Repository<Image>, flavorRepository: Repository<Flavor>);
    create(createProductDto: CreateProductDto): Promise<{
        images: Image[];
        flavors: any;
        category: import("./entities/product.entity").category;
        description: string;
        price: number;
        currency: import("./entities/product.entity").currency;
        stock: number;
        label: import("./entities/product.entity").label;
        presentacion: number;
    } & Product>;
    findAll(pagination: any): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    updateFlavor(id: string, updateFlavorDto: any): Promise<Product>;
    removeFlavor(id: string, updateFlavorDto: any): Promise<Product>;
    inactiveProduct(id: string): Promise<string>;
}
