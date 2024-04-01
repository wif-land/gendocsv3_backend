import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    // request object can be used to log when an error occurs
    // const request = ctx.getRequest()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      type:
        exception.response?.type || exception.response?.type || exception.name,
      title:
        exception.response?.title || exception.title || 'Internal Server Error',
      detail:
        exception.response?.detail ||
        exception.detail ||
        exception.message ||
        'Internal Server Error',
      instance:
        exception.response?.instance ||
        exception.instance ||
        exception.stack ||
        'Internal Server Error',
      error: exception.name,
    })
  }
}
