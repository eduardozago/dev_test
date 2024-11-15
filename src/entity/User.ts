import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

//TODO Crie a entidade de User
interface UserInterface {
    id?: number
    firstName: string
    lastName: string
    email: string
    posts?: Post[]
}

@Entity()
export class User{
    constructor(data: UserInterface) {
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
    } 

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @OneToMany(() => Post, (post) => post.userId)
    posts?: Post[]
}