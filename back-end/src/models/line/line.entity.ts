import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('lines')
export class Line {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @OneToOne(type => Whiteboard, whiteboard => whiteboard.line)
    whiteboard: Whiteboard
    @Column()
    color: string
    @Column()
    startX: number
    @Column()
    startY: number
}
