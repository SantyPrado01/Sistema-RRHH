import { CategoriaUsuario } from "src/categoria-usuario/entities/categoria-usuario.entity";
import { Empleado } from "src/empleados/entities/empleado.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm"

@Entity({
    name: 'Usuarios'
})

export class User {

    @PrimaryGeneratedColumn({type:'int',name: 'id',})
    id: number

    @Column({unique:true})
    username: string

    @Column()
    password: string

    @ManyToOne(()=> CategoriaUsuario, categoria => categoria.user )
    categoria: CategoriaUsuario[];

    @Column({default:false})
    eliminado: boolean

    @Column({default:true})
    primerIngreso: boolean
}