import { ProductService } from './product.service';
import { updateFlavorDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQuery } from 'src/dto/pagination.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<{
        images: import("./entities/image.entity").Image[];
        flavors: any;
        category: import("./entities/product.entity").category;
        description: string;
        price: number;
        currency: import("./entities/product.entity").currency;
        stock: number;
        label: import("./entities/product.entity").label;
        presentacion: number;
    } & import("./entities/product.entity").Product>;
    findAll(pagination?: PaginationQuery): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    updateFlavor(id: string, updateFlavorDto: updateFlavorDto): Promise<import("./entities/product.entity").Product>;
    removeFlavor(id: string, updateFlavorDto: updateFlavorDto): Promise<import("./entities/product.entity").Product>;
    inactiveProduct(id: string): Promise<string>;
}
