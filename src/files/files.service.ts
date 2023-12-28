import { Injectable } from '@nestjs/common'
import { GcpService } from '../gcp/gcp.service'

@Injectable()
export class FilesService {
  constructor(private readonly gcpService: GcpService) {}

  async createDocument(title: string): Promise<string> {
    return await this.gcpService.createDocument(title)
  }
}
