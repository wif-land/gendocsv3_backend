import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// you can implement a handleRequest method to log the information that comes in the request in the Authorization header

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
