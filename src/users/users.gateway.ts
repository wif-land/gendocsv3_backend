import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Catch, HttpException, Logger, UseFilters } from '@nestjs/common'

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
export class UsersGateway {
  @WebSocketServer()
  server: Server

  @UseFilters(WsAndHttpExceptionFilter)
  handleChangeAccessModules(
    @MessageBody()
    data: number[],
  ): void {
    this.server.emit('changeAccessModules', data)
  }
}
