import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { Empleado } from "src/empleados/entities/empleado.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'ciudad'
})

export class Ciudad {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    name:string

    @OneToMany(()=> Empleado, empleados => empleados.ciudad)
    empleados: Empleado[];

    @OneToMany(()=> Servicio, servicios => servicios.ciudad)
    servicios: Servicio[];


}
