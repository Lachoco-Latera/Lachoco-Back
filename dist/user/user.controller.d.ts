import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { PaginationQuery } from 'src/dto/pagination.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: createUserDto): Promise<{
        id: string;
        isActive: boolean;
        role: import("./entities/user.entity").Role;
        name: string;
        lastname: string;
        email: string;
    }>;
    signin(login: LoginDto): Promise<{
        success: string;
        token: string;
    }>;
    findAll(pagination?: PaginationQuery): Promise<{
        id: string;
        name: string;
        lastname: string;
        email: string;
        role: import("./entities/user.entity").Role;
        isActive: boolean;
        orders: import("../order/entities/order.entity").Order[];
        favoriteProducts: import("../product/entities/product.entity").Product[];
    }[]>;
    createAdmin(id: string): Promise<string>;
    remove(id: string): Promise<string>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        lastname: string;
        email: string;
        isActive: boolean;
        orders: import("../order/entities/order.entity").Order[];
        favoriteProducts: import("../product/entities/product.entity").Product[];
    }>;
}
