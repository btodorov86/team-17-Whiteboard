import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { WhiteBoardService } from '../whiteBoard/whiteBoard.service';

@WebSocketGateway({namespace: '/chat'})
export class AppGatewayChat implements OnGatewayInit{

  constructor (
    private readonly whiteboardService: WhiteBoardService,
  ) {}

  @WebSocketServer() wss: Server;
  async afterInit(server: Server): Promise<void> {
    console.log("Init");
  }
  // handleConnection(client: Socket, username: string): void {
  //   client.emit('connection', 'Successes connect')
  //   console.log("Connection");
  //   // console.log(username);
  // }
  // handleDisconnect(client: Socket) {
  //   console.log("Disconnect");
  // }
  // @SubscribeMessage('newMessage')
  // handleMessage(client: Socket, payload: {sender: string, room: string, message: string}) {
  //   client.emit('newMessage', payload)

  //   // this.wss.to(payload.room).emit('clientMessage', payload);
  // }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, message: { room: string, userName: string, avatar: string} ): Promise<void> {
    // console.log(message);

    client.join(message.room);
    client.emit('joinedToRoom', {...message, message: `Welcome ${message.userName}!`});
    client.to(message.room).emit('joinedToRoom', {...message, message: `${message.userName} has joined`});
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, message: { room: string, userName: string}): Promise<void> {
    // client.to(message.room).emit('leftRoom', `${message.userName} left chat`)
    // client.to(message.room).
    console.log(`${message.userName} - leave room`);

    client.leave(message.room);
  }

  @SubscribeMessage('send-message')
  async message(client: Socket, message: {message: string, from: string, room: string, avatar: string}): Promise<void> {
    // console.log(message);
    client.broadcast.to(message.room).emit('come-message', message)
  }
  @SubscribeMessage('someOneDrawShape')
  async drawShape(client: Socket, message: {room: string, shape: any }): Promise<void> {
    console.log(message.room);
    client.broadcast.to(message.room).emit('someOneDrawShape', message)
  }
  @SubscribeMessage('redo')
  async redo(client: Socket, message: {room: string, shape: any }): Promise<void> {
    // console.log(message.room);
    client.broadcast.to(message.room).emit('someOneRedo', message)
  }
  @SubscribeMessage('undo')
  async undo(client: Socket, message: {room: string, shapeId: string }): Promise<void> {
    console.log(message.room);
    client.broadcast.to(message.room).emit('someOneUndo', message)
  }
  // @SubscribeMessage('update')
  // update(client: Socket, message: { room: string, from: string}): void {
  //   console.log(message);
  //   client.to(message.room).broadcast.emit('incomingUpdate', message)

  // }
  @SubscribeMessage('sendMousePoints')
  async mousePoints(client: Socket, message: {
    user: string
    mouseX: number,
    mouseY: number,
    avatar: string,
    room: string,
  }): Promise<void> {
    // console.log(message);
    client.to(message.room).emit('incomingMousePoints', {
      user: message.user,
      avatar: message.avatar,
      mouseX: message.mouseX,
      mouseY: message.mouseY,
    })
  }
  // @SubscribeMessage('mesg')
  // message1(client: Socket, message: {room: string, msg: string, from: string, avatar: string}): void {
  //     console.log(message);

  //     client.to(message.room).emit('mesg', message)

  // }
  // @SubscribeMessage('send')
  // come(client: Socket, message: {room: string, x: string, from: string, y: string}): void {
  //   console.log(message);

  //     client.to(message.room).emit('come', message)

  // }
  // @SubscribeMessage('joinRoom')
  // async joinRoom(client: Socket, message: string ): Promise<void> {
  //   client.join(message);
  //   // client.emit('joinedToRoom', `Welcome ${message.userName}!`);
  //   // client.to(message.room).broadcast.emit('joinedToRoom', `${message.userName} has joined`);
  // }

  async youAreAdded(id: string, invitedId: string): Promise<void> {
    this.wss.emit('addedToBoard', {invitedId: invitedId, boardId: id})
  }

  @SubscribeMessage('invite')
  async invite(client: Socket, message: { whiteboardId: string, from: string, invited: string, whiteboardName: string} ): Promise<void> {
    this.wss.emit('sendInvite', message)

  }
  @SubscribeMessage('accept')
  async accept(client: Socket, message: { whiteboardId: string, from: string, invited: string, whiteboardName: string} ): Promise<void> {
    const boardId = await this.whiteboardService.inviteToBoard(message.from, message.invited, message.whiteboardId);
    this.wss.emit('userAccepted', message);
    this.wss.emit('addedToBoard', {boardId: boardId, from: message.from, invite: message.invited } )

  }
  @SubscribeMessage('kick')
  async kick(client: Socket, message: { whiteboardId: string, from: string, kicked: string, whiteboardName: string} ): Promise<void> {
    await this.whiteboardService.KickFromBoard(message.kicked, message.from, message.whiteboardId);
    this.wss.emit('isKicked', message);

  }
  @SubscribeMessage('decline')
  async decline(client: Socket, message: { whiteboardId: string, from: string, invited: string, whiteboardName: string} ): Promise<void> {
    this.wss.emit('userDeclined', message);

  }


}
