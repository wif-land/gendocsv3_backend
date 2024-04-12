export type PromiseApiResponse<T = { success: boolean }> = Promise<IResponse<T>>

export type ApiResponse<T = { success: boolean }> = IResponse<T>

interface IResponse<T> {
  message: string
  data: T
}
