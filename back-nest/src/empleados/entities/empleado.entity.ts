import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable, JoinColumn, OneToOne } from "typeorm";
import { DisponibilidadHoraria } from "../../disponibilidad-horaria/entities/disponibilidad-horaria.entity";
import { Categorias } from "../../categoria-empleado/entities/categoria-empleado.entity";

@Entity({
    name: 'Empleados'
})

export class Empleado {

    @PrimaryGeneratedColumn({type: 'int', name:'id'})
    Id: number
       
    @Column()
    legajo:number

    @Column()
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

    @Column({nullable:true})
    ciudad: number;

    @Column({default:''})
    observaciones: string;

    @ManyToOne(() => Categorias, categoria => categoria.empleados)
    categoria: Categorias[];
    
    @OneToMany(() => DisponibilidadHoraria, disponibilidad => disponibilidad.empleadoId, { eager: true })
    disponibilidades: DisponibilidadHoraria[];

    @Column({default:true})
    fulltime: boolean

    @Column()
    horasCategoria: number

}
