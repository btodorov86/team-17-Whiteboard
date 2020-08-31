import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { WhiteBoards } from '../whiteBoards/whiteBoards';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({unique: true, length: 10, type: 'nvarchar'})
    userName: string;
    @Column({ type: 'nvarchar'})
    firstName: string;
    @Column({ type: 'nvarchar'})
    lastName: string;
    @Column({unique: true})
    email: string;
    @Column()
    password: string;
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @OneToMany(type => WhiteBoards, whiteBoard => whiteBoard.author)
    whiteBoards: WhiteBoards[]
    @Column({ default: null, length: 500 })
    token: string
    @Column({nullable: true})
    avatarURL: string
}
