import { Empleado } from "src/empleados/entities/empleado.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'disponibilidadHoraria'
})

export class DisponibilidadHoraria {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number;

    @ManyToOne(()=> Empleado, empleado => empleado.disponibilidades)
    @JoinColumn({name: 'id'})
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
