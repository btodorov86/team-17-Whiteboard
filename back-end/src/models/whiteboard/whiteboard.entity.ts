import { User } from '../users/user.entity'
import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm'
import { TextBox } from '../textBox/textBox.entity'
import { Comment } from '../comment/comment.entity'

@Entity('whiteboards')
export class Whiteboard {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({type: 'boolean', default: false})
    isDeleted: boolean
    @Column({type: 'boolean', default: true})
    isPublic: boolean
    // bookId: number
    // @ManyToOne(type => User, user => user.whiteboards)
    @Column({ unique: true, type: 'nvarchar'})
    name: string;
    @ManyToOne(type => User, user => user.whiteboards )
    author: User
    @OneToMany(type => Line, line => line.whiteboard )
    lines: Line[]
    @OneToMany(type => Circle, circle => circle.whiteboard  )
    circles: Circle[]
    @OneToMany(type => Rectangle, rectangle => rectangle.whiteboard )
    rectangles: Rectangle[]
    @OneToMany(type => TextBox, textBox => textBox.whiteboard )
    textBoxes: TextBox[]
    @OneToMany(type => Comment, comment => comment.whiteboard )
    comments: Comment[]
    @ManyToMany(type => User, user => user.canUpdate)
    invitedUsers: User[]

}
