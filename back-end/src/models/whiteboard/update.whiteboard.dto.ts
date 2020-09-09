import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'

export class UpdateWhiteboardDTO {
    isPublic: boolean
    name: string
    lines: Line
    circles: Circle
    rectangles: Rectangle
}
