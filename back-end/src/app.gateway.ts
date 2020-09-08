import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'

@WebSocketGateway({ namespace: '/chat' })
export class AppGateway implements OnGatewayInit{

  @WebSocketServer() wss: Server;
  afterInit(server: Server): void {
    console.log("Init");
  }
  // handleConnection(client: Socket, ...args: any[]) {
  //   console.log("Connection");
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
  joinRoom(client: Socket, room: string): void {
    client.join(room);
    // console.log('join');


    // client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    // client.emit('leavedRoom', room);
  }

  @SubscribeMessage('send-message')
  message(client: Socket, message: {message: string, from: string, room: string, avatar: string}): void {
    console.log(message);
    client.to(message.room).broadcast.emit('come-message', message)

  }
  // @SubscribeMessage('mesg')
  // message1(client: Socket, message: {room: string, msg: string, from: string, avatar: string}): void {

  //     this.wss.to(message.room).emit('mesg', message)

  // }

}
