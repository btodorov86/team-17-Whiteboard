import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Whiteboard } from '../whiteboard/whiteboard.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(type => Whiteboard, whiteboard => whiteboard.comments)
    whiteboard: Whiteboard;
    @Column({default: 'comments'})
    type: string
    @Column()
    text: string;
    @Column()
    x: number
    @Column()
    y: number
    @Column({type: 'boolean', default: false})
    isDeleted: boolean


}
