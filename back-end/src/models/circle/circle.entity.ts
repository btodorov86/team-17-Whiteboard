import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('circles')
export class Circle {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.circles)
    whiteboard: Whiteboard;
    @Column()
    color: string;
    @Column()
    startX: number;
    @Column()
    startY: number;
    @Column()
    endX: number;
    @Column()
    endY: number;
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column()
    stroke: string
    @Column()
    strokeWidth: number


}
