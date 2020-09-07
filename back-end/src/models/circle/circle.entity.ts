import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('circles')
export class Circle {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.circle)
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

}
