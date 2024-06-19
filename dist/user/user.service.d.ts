import { Role, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    create(user: createUserDto): Promise<{
        id: string;
        isActive: boolean;
        role: Role;
        name: string;
        lastname: string;
        email: string;
    }>;
    loginUser(login: LoginDto): Promise<{
        success: string;
        token: string;
    }>;
    findAll(pagination: any): Promise<{
        id: string;
        name: string;
        lastname: string;
        email: string;
        role: Role;
        isActive: boolean;
        orders: import("../order/entities/order.entity").Order[];
        favoriteProducts: import("../product/entities/product.entity").Product[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        lastname: string;
        email: string;
        isActive: boolean;
        orders: import("../order/entities/order.entity").Order[];
        favoriteProducts: import("../product/entities/product.entity").Product[];
    }>;
    createAdmin(id: any): Promise<string>;
    inactiveUser(id: string): Promise<string>;
}
