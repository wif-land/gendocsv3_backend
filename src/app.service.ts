import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'

let alive = true

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService,
  ) {}

  onModuleInit(): void {
    // put some code here to run on application startup

    if (this.configService.get('NODE_ENV') === 'production') {
      // do something
    }
  }

  onModuleDestroy(): void {
    alive = false
  }

  @HealthCheck()
  async getHealthCheck(): Promise<boolean> {
    const checks = await this.health.check([
      () => this.http.pingCheck('ping', 'https://www.google.com'),
      () => this.db.pingCheck('database', { timeout: 10000 }),
    ])
    if (checks.status !== 'ok') {
      alive = false
    }
    if (!alive) throw new HttpException('Gone', HttpStatus.GONE)
    return Promise.resolve(true)
  }
}
