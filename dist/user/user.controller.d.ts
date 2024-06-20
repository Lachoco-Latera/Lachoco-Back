import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { PaginationQuery } from 'src/dto/pagination.dto';
import { userFavorites } from './dto/userFavorite.dto';
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
        country: string;
    }>;
    signin(login: LoginDto): Promise<{
        success: string;
        token: string;
    }>;
    findAll(pagination?: PaginationQuery): Promise<any>;
    createAdmin(id: string): Promise<string>;
    remove(id: string): Promise<string>;
    favorite(favorite: userFavorites): Promise<{
        userId: string;
        favoritesProducts: string[];
    }>;
    RemoveFavorite(userId: string, productId: string): Promise<void>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        lastname: string;
        email: string;
        country: string;
        isActive: boolean;
        orders: import("../order/entities/order.entity").Order[];
        favoriteProducts: import("../product/entities/product.entity").Product[];
    }>;
}
