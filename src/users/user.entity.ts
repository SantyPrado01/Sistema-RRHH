import { RolUsuario } from "src/rol-usuario/entities/rol-usuario.entity"
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm"

@Entity({
    name: 'Usuarios'
})

export class User {

    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
    })
    id: number

    @Column({unique:true})
    username: string

    @Column()
    password: string

    @ManyToOne(() => RolUsuario, rol => rol.usuarios)
    rol: RolUsuario;

}