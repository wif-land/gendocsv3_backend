export interface BaseResponse {
  message: string
  statusCode: number
  error?: string
  data?: unknown
}

export class BaseResponseEntity implements BaseResponse {
  constructor(data: BaseResponse) {
    this.message = data.message
    this.statusCode = data.statusCode
    this.error = data.error
    this.data = data.data
  }

  message: string
  statusCode: number
  error?: string
  data?: unknown
}
