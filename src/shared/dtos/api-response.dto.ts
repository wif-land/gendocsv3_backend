export class ApiResponseDto<T = { success: boolean }> {
  message: string
  data: T

  constructor(message: string, data: T) {
    this.message = message
    this.data = data
  }
}
