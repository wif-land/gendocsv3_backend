import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Log } from '../logs/log.entity'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') || ''

    response.on('finish', () => {
      this.logRepository
        .create({
          body: JSON.stringify(request.body),
          headers: JSON.stringify(request.headers),
          url: originalUrl,
          userAgent,
          ip,
          method,
        })
        .save()
    })

    next()
  }
}
