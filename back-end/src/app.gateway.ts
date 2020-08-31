import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'

@WebSocketGateway({ namespace: '/chat' })
export class AppGateway implements OnGatewayInit{

  @WebSocketServer() wss: Server;
  afterInit(server: Server) {
    console.log("Init");

  }
  // handleConnection(client: Socket, ...args: any[]) {
  //   console.log("Connection");
  // }
  // handleDisconnect(client: Socket) {
  //   console.log("Disconnect");
  // }
  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, payload: {sender: string, room: string, message: string}) {
    client.emit('newMessage', payload)

    // this.wss.to(payload.room).emit('clientMessage', payload);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: string) {
    client.join(room);
    // client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, room: string) {
    client.leave(room);
    // client.emit('leavedRoom', room);
  }

  @SubscribeMessage('mesg')
  mesge(client: Socket, msg: {room: string, msg: string}) {
    console.log(msg.msg);
    this.wss.to(msg.room).emit('mesg', msg)
  }

}
