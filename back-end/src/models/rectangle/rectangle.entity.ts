import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';


@Entity('rectangles')
export class Rectangle {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.rectangles)
    whiteboard: Whiteboard
    @Column()
    color: string
    @Column()
    startX: number
    @Column()
    startY: number
    @Column()
    endX: number
    @Column()
    endY: number
}
