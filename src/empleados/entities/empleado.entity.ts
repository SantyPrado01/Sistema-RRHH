import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { DisponibilidadHoraria } from "src/disponibilidad-horaria/entities/disponibilidad-horaria.entity";
import { CategoriaEmpleado } from "src/categoria-empleado/entities/categoria-empleado.entity";
import { Ciudad } from "src/ciudad/entities/ciudad.entity";

@Entity({
    name: 'Empleados'
})

export class Empleado {

    @PrimaryGeneratedColumn({
        type: 'int',
        name:'id'
    })
    id:number
       
    @Column()
    legajo:number

    @Column()
    nombre:string

    @Column()
    apellido:string

    @Column()
    nroDocumento: number

    @Column()
    telefono: number

    @Column()
    email: string

    @Column({ type: 'date' })
    fechaIngreso: Date

    @Column()
    eliminado: number

    @OneToMany(()=> CategoriaEmpleado, categoria => categoria.empleados)
    categorias: CategoriaEmpleado

    @OneToMany(() => DisponibilidadHoraria, disponibilidad => disponibilidad.empleado)
    disponibilidades: DisponibilidadHoraria[];

    @ManyToOne(()=> Ciudad, ciudad => ciudad.empleados)
    ciudad: Ciudad[]

}
