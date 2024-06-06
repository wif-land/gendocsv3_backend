import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { RoomsService } from '../services/rooms.service'
import { CreateRoomDto } from '../dto/create-room.dto'
import { UpdateRoomDto } from '../dto/update-room.dto'

@Controller('degree-certificates/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getRooms() {
    return await this.roomsService.findAllRooms()
  }

  @Post()
  async createRoom(@Body() dto: CreateRoomDto) {
    return await this.roomsService.createRoom(dto)
  }

  @Patch('/:id')
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
  ) {
    return await this.roomsService.updateRoom(id, dto)
  }

  @Delete('/:id')
  async deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return await this.roomsService.deleteRoom(id)
  }
}
