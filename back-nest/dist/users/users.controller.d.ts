import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(newUser: CreateUserDto): Promise<User | import("@nestjs/common").HttpException>;
    getUsers(): Promise<User[]>;
    getUsername(username: string): Promise<User>;
    getUser(id: number): Promise<User | import("@nestjs/common").HttpException>;
    deleteUser(id: number): Promise<import("@nestjs/common").HttpException>;
    updateUser(id: number, user: UpdateUserDto): Promise<import("@nestjs/common").HttpException | (User & UpdateUserDto)>;
}
