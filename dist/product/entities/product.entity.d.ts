import { Image } from './image.entity';
import { OrderDetailProduct } from 'src/order/entities/orderDetailsProdusct.entity';
import { Flavor } from 'src/flavor/entities/flavor.entity';
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
    label: label;
    isActive: boolean;
    images: Image[];
    flavors: Flavor[];
    orderDetailProducts: OrderDetailProduct[];
}
