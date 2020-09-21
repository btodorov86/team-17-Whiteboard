import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';


@Entity('rectangles')
export class Rectangle {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.rectangles)
    whiteboard: Whiteboard
    @Column({default: 'rectangles'})
    type: string
    @Column()
    itemPosition: number
    @Column()
    x: number
    @Column()
    y: number
    @Column()
    height: number
    @Column()
    width: number
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column()
    stroke: string
    @Column()
    fill: string
    @Column()
    strokeWidth: number
}
