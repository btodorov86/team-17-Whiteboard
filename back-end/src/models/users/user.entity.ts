import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

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
    @OneToMany(type => Whiteboard, whiteboard => whiteboard.author)
    whiteboards: Whiteboard[]
    @Column({ default: null, length: 500 })
    token: string
    @Column({ default: 'avatar.png'})
    avatarURL: string
    @JoinTable()
    @ManyToMany(type => Whiteboard, whiteboard => whiteboard.invitedUsers)
    canUpdate: Whiteboard[]
}
