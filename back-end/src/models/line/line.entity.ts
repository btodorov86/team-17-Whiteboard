import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('lines')
export class Line {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.lines)
    whiteboard: Whiteboard
    @Column({default: 'line'})
    type: string
    @Column()
    itemPosition: number;
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column({length: 5000})
    points: string
    @Column()
    stroke: string
    @Column()
    strokeWidth: number
}
