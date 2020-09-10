import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'
import { TextBox } from '../textBox/textBox.entity'

export class UpdateWhiteboardDTO {
    isPublic: boolean
    name: string
    lines: Line
    circles: Circle
    rectangles: Rectangle
    textBoxes: TextBox
}
