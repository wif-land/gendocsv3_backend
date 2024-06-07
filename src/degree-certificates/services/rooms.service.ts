import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RoomEntity } from '../entities/room.entity'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CreateRoomDto } from '../dto/create-room.dto'
import { DegreeCertificateAlreadyExists } from '../errors/degree-certificate-already-exists'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { UpdateRoomDto } from '../dto/update-room.dto'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async findAllRooms() {
    const rooms = await this.roomRepository.find()

    return new ApiResponseDto('Listado de salones obtenido exitosamente', rooms)
  }

  async createRoom(dto: CreateRoomDto) {
    if (
      this.roomRepository.findOneBy({
        name: dto.name,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El salón con nombre ${dto.name} ya existe`,
      )
    }

    const room = this.roomRepository.create(dto)

    if (!room) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del salón son incorrectos',
      )
    }

    const newRoom = await this.roomRepository.save(room)

    return new ApiResponseDto('Salón creado correctamente', newRoom)
  }

  async updateRoom(id: number, dto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({
      id,
      ...dto,
    })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    const roomUpdated = await this.roomRepository.save(room)

    return new ApiResponseDto('Salón actualizado correctamente', roomUpdated)
  }

  async deleteRoom(id: number) {
    const room = this.roomRepository.findOneBy({ id })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    await this.roomRepository.save({
      ...room,
      isActive: false,
    })

    return new ApiResponseDto('Salón eliminado correctamente', {
      success: true,
    })
  }
}
