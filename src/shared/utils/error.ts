import { HttpStatus } from '@nestjs/common'

export interface IError {
  message: string
  statuscode: HttpStatus
}

export class BaseError implements IError {
  constructor(message: string, statuscode: HttpStatus) {
    this.message = message
    this.statuscode = statuscode
  }

  message: string
  statuscode: HttpStatus
}
