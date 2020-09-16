import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('circles')
export class Circle {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.circles)
    whiteboard: Whiteboard;
    @Column({default: 'circle'})
    type: string
    @Column()
    x: number;
    @Column()
    y: number;
    @Column()
    itemPosition: number;
    @Column()
    radius: number;
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column()
    stroke: string
    @Column()
    fill: string
    @Column()
    strokeWidth: number


}
