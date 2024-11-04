import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horariosAsignados.entity'; 
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto'; 
import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity'; 
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

    async create(createHorariosDto: CreateHorariosAsignadoDto) {
        const { ordenTrabajoId } = createHorariosDto;
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: ordenTrabajoId },
            relations: ['empleadoAsignado', 'necesidadHoraria'], 
        });
    
        if (!ordenTrabajo) {
            throw new Error('Orden de trabajo no encontrada');
        }
    
        const { anio, mes, necesidadHoraria, empleadoAsignado } = ordenTrabajo;
        const horariosAsignados = [];
    
        for (const necesidad of necesidadHoraria) {
            const fechas = this.obtenerFechasDelMes(anio, mes, necesidad.diaSemana);
    
            for (const fecha of fechas) {
                const horarioAsignado = this.horarioAsignadoRepository.create({
                    ordenTrabajo,
                    empleado: empleadoAsignado,
                    fecha: fecha,
                    horaInicioProyectado: necesidad.horaInicio,
                    horaFinProyectado: necesidad.horaFin,
                    estado: 'pendiente',
                    suplente: false,
                    empleadoSuplente: null,
                });
                horariosAsignados.push(horarioAsignado);
            }
        }

        await this.horarioAsignadoRepository.save(horariosAsignados);
        return horariosAsignados;
    }

    private obtenerFechasDelMes(anio: number, mes: number, diaSemana: string): Date[] {
        const fechas: Date[] = [];
        const primerDiaMes = new Date(anio, mes - 1, 1);
        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const diaIndice = diasSemana.indexOf(diaSemana.toLowerCase());
    
        if (diaIndice === -1) return fechas;
    
        for (let dia = primerDiaMes.getDate(); dia <= new Date(anio, mes, 0).getDate(); dia++) {
          const fecha = new Date(anio, mes - 1, dia);
          if (fecha.getDay() === diaIndice) {
            fechas.push(fecha);
          }
        }
        return fechas;
      }

      async getHorariosAsignados(): Promise<HorarioAsignado[]> {
        const today = new Date();
        return this.horarioAsignadoRepository.find({
            where: {
                comprobado: false,
                fecha: LessThan(today), 
            },
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'], 
        });
    }

    async findAll(): Promise<HorarioAsignado[]> {
        return await this.horarioAsignadoRepository.find({
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'], // Incluir relaciones si es necesario
        });
    }

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