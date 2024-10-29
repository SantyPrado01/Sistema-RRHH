import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horarios-asignado.entity'; 
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { OrdenTrabajo } from 'src/orden-trabajo/entities/orden-trabajo.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Injectable()
export class HorarioAsignadoService {
    constructor(
        @InjectRepository(HorarioAsignado)
        private readonly horarioAsignadoRepository: Repository<HorarioAsignado>,

        @InjectRepository(OrdenTrabajo)
        private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,

        @InjectRepository(Empleado)
        private readonly empleadoRepository: Repository<Empleado>,
    ) {}

    // horarios-asignados.service.ts
    async create(ordenTrabajoId: number): Promise<HorarioAsignado[]> {
    const ordenTrabajoExistente = await this.ordenTrabajoRepository.findOne({
        where: { ordenTrabajoId },
    });

    if (!ordenTrabajoExistente) {
        throw new NotFoundException('Orden de trabajo no encontrada');
    }

    // Obtener detalles necesarios de la orden de trabajo
    const { anio, mes, dias, horaInicio, horaFin } = ordenTrabajoExistente;

    // Inicializar un array para los horarios asignados
    const horariosAsignados: HorarioAsignado[] = [];
    const primerDia = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);

    const diasDeLaSemana: { [key: string]: number } = {
        'Domingo': 0,
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6,
    };

    for (let dia = primerDia.getDate(); dia <= ultimoDia.getDate(); dia++) {
        const fechaActual = new Date(anio, mes - 1, dia);
        const diaDeLaSemana = fechaActual.toLocaleString('es-ES', { weekday: 'long' });

        if (diasDeLaSemana[diaDeLaSemana] !== undefined && dias.includes(diaDeLaSemana)) {
            const horarioAsignado = this.horarioAsignadoRepository.create({
                //ordenTrabajoId: ordenTrabajoExistente.ordenTrabajoId,
                //empleadoAsignadoId: ordenTrabajoExistente.empleadoAsignado.empleadoId,
                fecha: fechaActual,
                horaInicioProyectado: horaInicio,
                horaFinProyectado: horaFin,
                estado: 'pendiente',
                suplente: false,
            });

            horariosAsignados.push(horarioAsignado);
        }
    }

    return await this.horarioAsignadoRepository.save(horariosAsignados);
    }


    // Obtener todos los horarios asignados
    async findAll(): Promise<HorarioAsignado[]> {
        return await this.horarioAsignadoRepository.find({
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'], // Incluir relaciones si es necesario
        });
    }

    // Obtener un horario asignado por ID
    async findOne(id: number): Promise<HorarioAsignado> {
        const horarioAsignado = await this.horarioAsignadoRepository.findOne({
            where: { horarioAsignadoId: id },
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'],
        });

        if (!horarioAsignado) {
            throw new NotFoundException('Horario asignado no encontrado');
        }

        return horarioAsignado;
    }

    // Actualizar un horario asignado
    async update(id: number, updateData: Partial<CreateHorariosAsignadoDto>): Promise<HorarioAsignado> {
        await this.horarioAsignadoRepository.update(id, updateData);
        return this.findOne(id); // Devolver el horario actualizado
    }

    // Eliminar un horario asignado
    async remove(id: number): Promise<void> {
        const result = await this.horarioAsignadoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Horario asignado no encontrado');
        }
    }
}
