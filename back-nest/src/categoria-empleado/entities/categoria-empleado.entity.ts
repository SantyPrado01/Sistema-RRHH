import { Servicio } from "src/servicios/entities/servicio.entity";
import { Empleado } from "../../empleados/entities/empleado.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'categoria'})

export class Categorias {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    nombre: string

    @Column({default: false})
    eliminado: boolean;

    @OneToMany(()=> Empleado, empleado => empleado.categoria)
    empleados?: Empleado

    @OneToMany(()=> Servicio, servicio => servicio.categoria)
    servicios?: Empleado


}
