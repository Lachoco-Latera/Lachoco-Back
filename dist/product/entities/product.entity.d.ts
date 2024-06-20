import { Image } from './image.entity';
import { Flavor } from './sabor.entity';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
export declare enum category {
    BOMBAS = "bombas",
    TABLETAS = "tabletas",
    BOMBONES = "bombones"
}
export declare enum label {
    ONLINE = "SoloOnline",
    NEW = "nuevo"
}
export declare enum currency {
    COP = "COP",
    USD = "USD",
    EUR = "EUR"
}
export declare class Product {
    id: string;
    category: category;
    presentacion: number;
    description: string;
    price: number;
    currency: currency;
    stock: number;
    label: label;
    isActive: boolean;
    images: Image[];
    flavors: Flavor[];
    orderDetailProducts: OrderDetailProduct[];
}
