import { Empleado } from "../../empleados/entities/empleado.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'disponibilidadHoraria'
})

export class DisponibilidadHoraria {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    disponibilidadHorariaId:number;

    @ManyToOne(()=> Empleado, empleado => empleado.disponibilidad)
    @JoinColumn({name: 'empleado_id'})
    empleado: Empleado;

    @Column({type: 'tinyint'})
    diaSemana:number

    @Column({type: 'time'})
    horaInicio:string

    @Column({type: 'time'})
    horaFin:string

    @Column({type:'date'})
    fechaInicio: string

    @Column({type:'date'})
    fechaFin:string


}
