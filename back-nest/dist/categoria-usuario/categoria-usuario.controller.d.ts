import { CategoriaUsuarioService } from './categoria-usuario.service';
import { CreateCategoriaUsuarioDto } from './dto/create-categoria-usuario.dto';
import { UpdateCategoriaUsuarioDto } from './dto/update-categoria-usuario.dto';
export declare class CategoriaUsuarioController {
    private readonly categoriaUsuarioService;
    constructor(categoriaUsuarioService: CategoriaUsuarioService);
    create(createCategoriaUsuarioDto: CreateCategoriaUsuarioDto): Promise<import("@nestjs/common").HttpException | {
        message: string;
        categoriaUsuario: import("./entities/categoria-usuario.entity").CategoriaUsuario;
    }>;
    findAll(): Promise<import("./entities/categoria-usuario.entity").CategoriaUsuario[]>;
    findOne(id: string): Promise<import("@nestjs/common").HttpException | import("./entities/categoria-usuario.entity").CategoriaUsuario>;
    update(id: string, updateCategoriaUsuarioDto: UpdateCategoriaUsuarioDto): Promise<import("@nestjs/common").HttpException | (import("./entities/categoria-usuario.entity").CategoriaUsuario & UpdateCategoriaUsuarioDto)>;
    remove(id: string): Promise<import("@nestjs/common").HttpException>;
}
