import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'
import { TextBox } from '../textBox/textBox.entity'
import { ReturnLineDTO } from '../line/return.line.dto'
import { Comment } from '../comment/comment.entity'

export class ReturnWhiteboardDTO {
    id: string
    isPublic: boolean
    name: string
    author: string
    line: ReturnLineDTO[]
    circle: Circle[]
    rectangle: Rectangle[]
    textBoxes: TextBox[]
    comments: Comment[]
}
