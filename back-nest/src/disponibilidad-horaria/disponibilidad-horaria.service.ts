import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisponibilidadHoraria } from './entities/disponibilidad-horaria.entity';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
import { Empleado } from 'src/empleados/entities/empleado.entity';  

@Injectable()
export class DisponibilidadHorariaService {
    constructor(
        @InjectRepository(DisponibilidadHoraria)
        private readonly disponibilidadHorariaRepository: Repository<DisponibilidadHoraria>,
        @InjectRepository(Empleado)
        private readonly empleadoService: Repository<Empleado>,
    ) {}

    async findAll(): Promise<DisponibilidadHoraria[]> {
        return this.disponibilidadHorariaRepository.find({ relations: ['empleado'] });
    }

    async findOne(id: number): Promise<DisponibilidadHoraria> {
        const disponibilidad = await this.disponibilidadHorariaRepository.findOne({
            where: { disponibilidadHorariaId: id },
            relations: ['empleado'],
        });
        if (!disponibilidad) {
            throw new NotFoundException(`Disponibilidad horaria con ID ${id} no encontrada`);
        }
        return disponibilidad;
    }

    async update(id: number, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): Promise<DisponibilidadHoraria> {
        const disponibilidad = await this.disponibilidadHorariaRepository.preload({
            disponibilidadHorariaId: id,
            ...updateDisponibilidadHorariaDto,
        });
        if (!disponibilidad) {
            throw new NotFoundException(`Disponibilidad horaria con ID ${id} no encontrada`);
        }
        return this.disponibilidadHorariaRepository.save(disponibilidad);
    }

    async remove(id: number): Promise<void> {
        const result = await this.disponibilidadHorariaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Disponibilidad horaria con ID ${id} no encontrada`);
        }
    }
}
