import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Catch, HttpException, Logger, UseFilters } from '@nestjs/common'
import { NotificationEntity } from './entities/notification.entity'

@Catch(WsException, HttpException)
class WsAndHttpExceptionFilter {
  // public catch(exception: HttpException, host: ArgumentsHost) {
  public catch(exception: WsException) {
    Logger.error('An error occurred in the WebSocket connection:', exception)
    throw exception
  }
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server

  @UseFilters(WsAndHttpExceptionFilter)
  handleSendNotification(@MessageBody() data: NotificationEntity): void {
    this.server.emit('notification', data)
  }
}
