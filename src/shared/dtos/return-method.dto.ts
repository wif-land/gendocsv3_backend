import { HttpException } from '@nestjs/common/exceptions/http.exception'

export class ReturnMethodDto<T> {
  error?: HttpException | Error | null
  data?: T

  constructor(data?: T, errors?: HttpException | Error | null) {
    this.data = data
    this.error = errors
  }
}
