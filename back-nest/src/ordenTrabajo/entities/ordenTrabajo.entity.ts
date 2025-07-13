import { Empleado } from "../../empleados/entities/empleado.entity";
import { HorarioAsignado } from "src/horariosAsignados/entities/horariosAsignados.entity"; 
import { NecesidadHoraria } from "src/necesidadHoraria/entities/necesidadHoraria.entity"; 
import { Servicio } from "../../servicios/entities/servicio.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('ordenesTrabajo')
export class OrdenTrabajo {

    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => Servicio, (servicio) => servicio.ordenesTrabajo, { eager: true })
    servicio: Servicio;

    @ManyToOne(() => Empleado, { nullable: false })
    empleadoAsignado: Empleado;  

    @OneToMany(() => HorarioAsignado, (horario) => horario.ordenTrabajo, {eager:true})
    horariosAsignados?: HorarioAsignado[];

    @OneToMany(() => NecesidadHoraria, (necesidades) => necesidades.ordenTrabajo, { eager: true })
    necesidadHoraria?: NecesidadHoraria[];

    @Column()
    mes?: number; 

    @Column()
    anio?: number;

    @Column({type: 'date', nullable: true})
    fechaInicio?: Date;

    @Column({type: 'date', nullable: true})
    fechaFin?: Date;

    @Column({default:false})
    completado: boolean;

    @Column({default:false})
    eliminado?: boolean;

    @Column({ nullable: true })
    fechaEliminado?: Date;

    @Column({ default: false })
    renovacionAutomatica: boolean;

}