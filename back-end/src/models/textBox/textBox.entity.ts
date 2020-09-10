import { Entity, PrimaryGeneratedColumn, OneToOne, Column, OneToMany, ManyToOne } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('textboxes')
export class TextBox {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.textBoxes)
    whiteboard: Whiteboard
    @Column()
    color: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column({length: 5000})
    points: string
    @Column()
    stroke: string
    @Column()
    strokeWidth: number
}
