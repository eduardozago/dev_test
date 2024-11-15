import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

//TODO Crie a entidade de Post
interface PostInterface {
    id?: number
    title: string
    description: string
    userId: User
}

@Entity()
export class Post {
    constructor(data: PostInterface) {
        this.title = data.title
        this.description = data.description
        this.userId = data.userId
    }

    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    title: string

    @Column()
    description: string

    @ManyToOne(() => User, (user) => user.posts)
    userId: User 
}