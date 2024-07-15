import { RedisMemoryServer } from 'redis-memory-server'

export class RedisTestConnection {
  static _redisMemoryServer: RedisMemoryServer

  static async createConnection(): Promise<{ port: number; host: string }> {
    this._redisMemoryServer = new RedisMemoryServer({ autoStart: false })

    const [host, port] = await Promise.all([
      this._redisMemoryServer.getHost(),
      this._redisMemoryServer.getPort(),
    ])

    return { host, port }
  }

  static async closeConnection(): Promise<void> {
    if (this._redisMemoryServer) {
      await this._redisMemoryServer.stop()
    }
  }
}
