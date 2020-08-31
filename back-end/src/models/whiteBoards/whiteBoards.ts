import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'
import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'

@Entity('whiteBoards')
export class WhiteBoards {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    // bookId: number
    @ManyToOne(type => User, user => user.whiteBoards)
    author: User
    @OneToMany(type => Line, line => line.whiteBoard )
    line: Line[]
    @OneToMany(type => Circle, circle => circle.whiteBoard  )
    circle: Circle[]
    @OneToMany(type => Rectangle, rectangle => rectangle.whiteBoard )
    rectangle: Rectangle[]
}
