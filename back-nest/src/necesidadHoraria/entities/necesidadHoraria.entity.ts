import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity'; 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({
    name:'necesidadHoraria'
})

export class NecesidadHoraria {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    necesidadHorariaId:number

    @ManyToOne(()=> OrdenTrabajo, ordenTrabajo => ordenTrabajo.necesidadHoraria)
    ordenTrabajo: OrdenTrabajo;

    @Column()
    diaSemana:string

    @Column({type: 'time'})
    horaInicio:string

    @Column({type: 'time'})
    horaFin:string

}