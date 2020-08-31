import { Entity, PrimaryGeneratedColumn, OneToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { WhiteBoards } from '../whiteBoards/whiteBoards';

@Entity('line')
export class Line {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @OneToOne(type => WhiteBoards, whiteBoards => whiteBoards.line)
    whiteBoard: WhiteBoards
    @Column({type: 'number'})
    startX: number
    @Column({type: 'number'})
    startY: number
}
