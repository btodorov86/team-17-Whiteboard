import { Injectable } from '@nestjs/common';
import { User } from 'src/models/users/user.entity';
import { ReturnUserDTO } from 'src/models/users/return.user.dto';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { ReturnWhiteboardDTO } from 'src/models/whiteboard/return.whiteboard.dto';
import { ReturnCreatedWhiteboardDTO } from 'src/models/whiteboard/return.created.whiteboard.dto';
import { Line } from 'src/models/line/line.entity';
import { ReturnLineDTO } from 'src/models/line/return.line.dto';

@Injectable()
export class TransformService {
  toReturnUserDto(user: User, token = false): ReturnUserDTO {
    if (token) {
      return {
        id: user.id,
        // firstName: user.firstName,
        // lastName: user.lastName,
        // email: user.email,
        userName: user.userName,
        avatarURL: user.avatarURL,

      };
    }
    return {
      id: user.id,
      // firstName: user.firstName,
      // lastName: user.lastName,
      // email: user.email,
      userName: user.userName,
      avatarURL: user.avatarURL,

    };
  }
  toReturnLineDto(line: Line): ReturnLineDTO {
      return {
        id: line.id,
        itemPosition: line.itemPosition,
        type: line.type,
        points: line.points.split(',').map(Number),
        stroke: line.stroke,
        strokeWidth: line.strokeWidth
      };
  }

  toReturnWhiteboardDto(whiteboard: Whiteboard): ReturnWhiteboardDTO {
    return {
      author: whiteboard.author.userName,
      id: whiteboard.id,
      isPublic: whiteboard.isPublic,
      circle: whiteboard.circles,
      line: whiteboard.lines.map( x => this.toReturnLineDto(x)),
      name: whiteboard.name,
      rectangle: whiteboard.rectangles,
      textBoxes: whiteboard.textBoxes
    }
  }
  toReturnCreatedWhiteboardDto(whiteboard: Whiteboard, user: User): ReturnCreatedWhiteboardDTO {
    return {
      author: user.userName,
      id: whiteboard.id,
      isPublic: whiteboard.isPublic,
      name: whiteboard.name,
    }
  }
  toSimpleReturnWhiteboardDto(whiteboard: Whiteboard, user: User): ReturnCreatedWhiteboardDTO {
    return {
      author: user.id,
      id: whiteboard.id,
      isPublic: whiteboard.isPublic,
      name: whiteboard.name,
    }
  }
}
