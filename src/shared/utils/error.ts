import { HttpException, HttpStatus } from '@nestjs/common'

export interface IError {
  statuscode: HttpStatus
  type?: string
  title?: string
  detail: string
  instance: string
}

export class BaseError extends HttpException implements IError {
  constructor(
    public statuscode: HttpStatus,
    public type: string,
    public title: string,
    public detail: string,
    public instance: string,
  ) {
    super(
      {
        statuscode,
        type,
        title,
        detail,
        instance,
      },
      statuscode,
      {
        cause: new Error(detail),
      },
    )
  }
}
