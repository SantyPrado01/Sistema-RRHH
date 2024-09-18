import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable } from "typeorm";
import { DisponibilidadHoraria } from "../../disponibilidad-horaria/entities/disponibilidad-horaria.entity";
import { CategoriaEmpleado } from "../../categoria-empleado/entities/categoria-empleado.entity";

@Entity({
    name: 'Empleados'
})

export class Empleado {

    @PrimaryGeneratedColumn({
        type: 'int',
        name:'id'
    })
    empleadoId: number
       
    @Column()
    legajo:number

    @Column({ name: 'empleadoNombre' })
    nombre:string

    @Column()
    apellido:string

    @Column()
    nroDocumento: number

    @Column()
    telefono: string

    @Column()
    email: string

    @Column({ type: 'date' })
    fechaIngreso: Date

    @Column({default: false})
    eliminado: boolean

    @Column()
    ciudad: number;

    @Column()
    observaciones: string;

    @ManyToOne(() => CategoriaEmpleado, categoria => categoria.empleados, { eager: true })
    @JoinTable({name: "categoria"})
    categoria: CategoriaEmpleado;

    @ManyToOne(() => DisponibilidadHoraria, disponibilidad => disponibilidad.empleado, { eager: true })
    @JoinTable({name:'disponibilidad'})
    disponibilidad: DisponibilidadHoraria;

}
