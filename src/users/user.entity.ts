import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

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

    @Column()
    rol: string

}