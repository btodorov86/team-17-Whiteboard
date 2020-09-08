import { User } from '../users/user.entity'
import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'

@Entity('whiteboards')
export class Whiteboard {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    // bookId: number
    // @ManyToOne(type => User, user => user.whiteboards)
    @Column({ type: 'nvarchar'})
    name: string;
    @Column({ type: 'nvarchar'})
    author: User
    @OneToMany(type => Line, line => line.whiteboard )
    line: Line[]
    @OneToMany(type => Circle, circle => circle.whiteboard  )
    circle: Circle[]
    @OneToMany(type => Rectangle, rectangle => rectangle.whiteboard )
    rectangle: Rectangle[]
}
