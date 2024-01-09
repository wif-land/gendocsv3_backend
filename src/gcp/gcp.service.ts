import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleAuth } from 'google-auth-library'
import { docs, docs_v1 } from '@googleapis/docs'
import { drive, drive_v3 } from '@googleapis/drive'

@Injectable()
export class GcpService {
  private drive: drive_v3.Drive
  private docs: docs_v1.Docs

  constructor(private configService: ConfigService) {
    const auth: GoogleAuth = new GoogleAuth({
      keyFilename: this.configService.get('gcp.credentialsPath'),
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
      ],
    })

    this.drive = drive({
      version: 'v3',
      auth,
    })

    this.docs = docs({
      version: 'v1',
      auth,
    })
  }

  async createDocument(title: string): Promise<string> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [this.configService.get('gcp.rootDriveFolderId')],
      },
    })

    return data.id
  }

  async createDocumentByParentId(
    title: string,
    parentId: string,
  ): Promise<string> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [parentId],
      },
    })

    return data.id
  }

  async renameDocument(documentId: string, title: string): Promise<string> {
    const { data } = await this.drive.files.update({
      fileId: documentId,
      requestBody: {
        name: title,
      },
    })

    return data.id
  }

  async createFolder(title: string): Promise<string> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.configService.get('gcp.rootDriveFolderId')],
      },
    })

    return data.id
  }

  async createFolderByParentId(
    title: string,
    parentId: string,
  ): Promise<string> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
    })

    return data.id
  }

  async renameFolder(folderId: string, title: string): Promise<string> {
    const { data } = await this.drive.files.update({
      fileId: folderId,
      requestBody: {
        name: title,
      },
    })

    return data.id
  }
}
