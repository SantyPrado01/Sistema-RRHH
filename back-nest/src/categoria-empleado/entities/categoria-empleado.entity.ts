import { Empleado } from "../../empleados/entities/empleado.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categoriaEmpleado'
})

export class CategoriaEmpleado {

    @PrimaryGeneratedColumn({type:'int', name:'id'})
    categoriaEmpleadoId:number

    @Column()
    categoriaEmpleadoNombre: string

    @Column({default: false})
    eliminado: boolean;

    @OneToMany(()=> Empleado, empleado => empleado.categoria)
    empleados: Empleado

}
