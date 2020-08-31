import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WhiteBoards } from '../whiteBoards/whiteBoards';

@Entity('circle')
export class Circle {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(type => WhiteBoards, whiteBoards => whiteBoards.circle)
    whiteBoard: WhiteBoards;
    @Column({type: 'number'})
    startX: number
    @Column({type: 'number'})
    startY: number
    @Column({type: 'number'})
    endX: number
    @Column({type: 'number'})
    endY: number

}
