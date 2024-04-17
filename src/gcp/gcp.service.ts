import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleAuth } from 'google-auth-library'
import { docs, docs_v1 } from '@googleapis/docs'
import { drive, drive_v3 } from '@googleapis/drive'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

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

  async createDocument(title: string) {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [this.configService.get('gcp.rootDriveFolderId')],
      },
    })

    return new ApiResponseDto('Documento creado con éxito', data.id)
  }

  async createDocumentByParentId(title: string, parentId: string) {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [parentId],
      },
    })

    return new ApiResponseDto('Subdocumento creado con éxito', data.id)
  }

  async createDocumentByParentIdAndCopy(
    title: string,
    parentId: string,
    documentId: string,
  ) {
    const { data } = await this.drive.files.copy({
      fileId: documentId,
      requestBody: {
        name: title,
        parents: [parentId],
      },
    })
    return new ApiResponseDto(
      'Subdocumento creado y copiado con éxito',
      data.id,
    )
  }

  async renameAsset(assetId: string, title: string) {
    const { data } = await this.drive.files.update({
      fileId: assetId,
      requestBody: {
        name: title,
      },
    })

    return new ApiResponseDto('Documento renombrado con éxito', data.id)
  }

  async moveAsset(assetId: string, parentId: string) {
    const { data } = await this.drive.files.update({
      fileId: assetId,
      addParents: parentId,
      removeParents: this.configService.get('gcp.rootDriveFolderId'),
    })

    return new ApiResponseDto('Documento movido con éxito', data.id)
  }

  async createFolder(title: string) {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.configService.get('gcp.rootDriveFolderId')],
      },
    })

    return new ApiResponseDto('Carpeta creada con éxito', data.id)
  }

  async createFolderByParentId(title: string, parentId: string) {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
    })

    return new ApiResponseDto('Subcarpeta creada con éxito', data.id)
  }

  async replaceTextOnDocument(data: object, documentId: string) {
    try {
      const requests = Object.keys(data).map((key) => ({
        replaceAllText: {
          containsText: {
            text: `${key}`,
            matchCase: true,
          },
          replaceText: data[key],
        },
      }))

      await this.docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests,
        },
      })

      return new ApiResponseDto('Texto reemplazado con éxito', {
        success: true,
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async remove(assetId: string) {
    try {
      await this.drive.files.delete({
        fileId: assetId,
      })

      return new ApiResponseDto('Documento eliminado con éxito', {
        success: true,
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
