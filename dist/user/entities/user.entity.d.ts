import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
export declare enum Role {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    CLIENT = "CLIENT"
}
export declare class User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
    orders: Order[];
    favoriteProducts: Product[];
}
