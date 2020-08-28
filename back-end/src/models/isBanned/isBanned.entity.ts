import { Entity, PrimaryGeneratedColumn, OneToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class IsBanned {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @OneToOne(type => User, user => user.isBanned)
    owner: User
    @Column()
    description: string
    @CreateDateColumn()
    banDate: Date
    @Column({ type: Date })
    expirationDate: Date
}
