import { ProductService } from './product.service';
import { updateFlavorDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationQuery } from 'src/dto/pagination.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<any>;
    findAll(pagination?: PaginationQuery): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    updateFlavor(id: string, updateFlavorDto: updateFlavorDto): Promise<import("./entities/product.entity").Product>;
    removeFlavor(id: string, updateFlavorDto: updateFlavorDto): Promise<import("./entities/product.entity").Product>;
    inactiveProduct(id: string): Promise<string>;
}
