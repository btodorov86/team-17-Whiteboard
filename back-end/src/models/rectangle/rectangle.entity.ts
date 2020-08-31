import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { WhiteBoards } from '../whiteBoards/whiteBoards';


@Entity('rectangle')
export class Rectangle {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => WhiteBoards, whiteBoards => whiteBoards.rectangle)
    whiteBoard: WhiteBoards
    @Column({type: 'number'})
    startX: number
    @Column({type: 'number'})
    startY: number
    @Column({type: 'number'})
    endX: number
    @Column({type: 'number'})
    endY: number
}
