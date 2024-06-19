import { User } from 'src/user/entities/user.entity';
import { Image } from './image.entity';
export declare enum category {
    BOMBAS = "bombas",
    TABLETAS = "tabletas",
    BOMBONES = "bombbones"
}
export declare enum label {
    ONLINE = "SoloOnline",
    NEW = "nuevo"
}
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: category;
    label: label;
    images: Image[];
    user: User;
}
