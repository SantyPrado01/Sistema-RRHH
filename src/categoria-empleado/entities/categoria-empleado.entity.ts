import { Empleado } from "src/empleados/entities/empleado.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categoriaEmpleado'
})

export class CategoriaEmpleado {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    id:number

    @Column()
    name: string

    @OneToMany(()=> Empleado, empleado => empleado.categorias)
    empleados: Empleado

}
