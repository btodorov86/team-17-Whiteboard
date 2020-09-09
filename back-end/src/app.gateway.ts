import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { IUpdate } from './models/whiteboard/update';

@WebSocketGateway({ namespace: '/chat' })
export class AppGateway implements OnGatewayInit{

  @WebSocketServer() wss: Server;
  afterInit(server: Server): void {
    // console.log("Init");
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
  joinRoom(client: Socket, message: { room: string, userName: string} ): void {
    client.join(message.room);
    client.emit('joinedToRoom', `Welcome ${message.userName}!`);
    client.to(message.room).broadcast.emit('joinedToRoom', `${message.userName} has joined`);


    // client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, message: { room: string, userName: string}): void {
    client.to(message.room).broadcast.emit('leftRoom', `${message.userName} left chat`)
    client.leave(message.room);
    console.log('leave');

    // client.emit('leavedRoom', room);
  }

  @SubscribeMessage('send-message')
  message(client: Socket, message: {message: string, from: string, room: string, avatar: string}): void {
    console.log(message);
    client.to(message.room).broadcast.emit('come-message', message)

  }
  @SubscribeMessage('update')
  update(client: Socket, message: { room: string, from: string}): void {
    console.log(message);
    client.to(message.room).broadcast.emit('incomingUpdate', message)

  }
  @SubscribeMessage('sendMousePoints')
  mousePoints(client: Socket, message: {
    user: string
    mouseX: number,
    mouseY: number,
    avatar: string,
    room: string,
  }): void {
    // console.log(message);
    client.to(message.room).broadcast.emit('incomingMousePoints', {
      id: message.user,
      avatar: message.avatar,
      mouseX: message.mouseX,
      mouseY: message.mouseY,
    })
  }
  // @SubscribeMessage('mesg')
  // message1(client: Socket, message: {room: string, msg: string, from: string, avatar: string}): void {

  //     this.wss.to(message.room).emit('mesg', message)

  // }

}
