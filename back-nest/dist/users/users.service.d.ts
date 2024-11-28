import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException } from '@nestjs/common';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUsers(): Promise<User[]>;
    getUsername(username: string): Promise<User>;
    getUserId(id: number): Promise<User>;
    deleteUser(id: number): Promise<HttpException>;
    updateUser(id: number, user: UpdateUserDto): Promise<HttpException | (User & UpdateUserDto)>;
}
