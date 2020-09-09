import { Rectangle } from '../rectangle/rectangle.entity'
import { Circle } from '../circle/circle.entity'
import { Line } from '../line/line.entity'

export class ReturnWhiteboardDTO {
    id: string
    isPublic: boolean
    name: string
    author: string
    line: Line[]
    circle: Circle[]
    rectangle: Rectangle[]
}
