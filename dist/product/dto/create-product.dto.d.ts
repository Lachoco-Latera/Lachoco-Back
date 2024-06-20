import { category, label, currency } from 'src/product/entities/product.entity';
export declare class CreateProductDto {
    category: category;
    description: string;
    price: number;
    currency: currency;
    stock: number;
    label: label;
    presentacion: number;
    images: string[];
    flavors: string[];
}
