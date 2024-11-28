import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<User[]>;
    getUsername(username: string): Promise<User>;
    getUser(id: number): Promise<User>;
    deleteUser(id: number): Promise<import("@nestjs/common").HttpException>;
    updateUser(id: number, user: UpdateUserDto): Promise<import("@nestjs/common").HttpException | (User & UpdateUserDto)>;
}
