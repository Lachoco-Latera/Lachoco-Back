import { category, label } from 'src/product/entities/product.entity';
export declare class CreateProductDto {
    category: category;
    description: string;
    price: number;
    stock: number;
    label: label;
    presentacion: number;
    images: string[];
    flavors: string[];
}
