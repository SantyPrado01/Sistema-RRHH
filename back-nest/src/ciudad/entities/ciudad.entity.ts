import { Empleado } from "../../empleados/entities/empleado.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'ciudad'
})

export class Ciudad {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    idCiudad:number

    @Column()
    nombreCiudad:string

    @Column({default: false})
    eliminado: boolean

    @OneToMany(()=> Empleado, empleados => empleados.ciudad)
    empleados: Empleado[];

    @OneToMany(()=> Servicio, servicios => servicios.ciudad)
    servicios: Servicio[];


}
