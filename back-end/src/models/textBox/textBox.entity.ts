import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('textboxes')
export class TextBox {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.textBoxes)
    whiteboard: Whiteboard
    @Column({default: 'textBoxes'})
    type: string
    @Column()
    itemPosition: number
    @Column()
    x: number;
    @Column()
    y: number;
    @Column()
    fill: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column()
    text: string
    @Column()
    fontStyle: string
    @Column()
    textDecoration: string
    @Column()
    fontSize: number
}
