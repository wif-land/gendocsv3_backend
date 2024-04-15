import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleAuth } from 'google-auth-library'
import { docs, docs_v1 } from '@googleapis/docs'
import { drive, drive_v3 } from '@googleapis/drive'
import { ApiResponse } from '../shared/interfaces/response.interface'

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

  async createDocument(title: string): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [this.configService.get('gcp.rootDriveFolderId')],
      },
    })

    return {
      message: 'Documento creado con éxito',
      data: data.id,
    }
  }

  async createDocumentByParentId(
    title: string,
    parentId: string,
  ): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [parentId],
      },
    })

    return {
      message: 'Subdocumento creado con éxito',
      data: data.id,
    }
  }

  async createDocumentByParentIdAndCopy(
    title: string,
    parentId: string,
    documentId: string,
  ): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.copy({
      fileId: documentId,
      requestBody: {
        name: title,
        parents: [parentId],
      },
    })
    return {
      message: 'Subdocumento creado y copiado con éxito',
      data: data.id,
    }
  }

  async renameAsset(
    assetId: string,
    title: string,
  ): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.update({
      fileId: assetId,
      requestBody: {
        name: title,
      },
    })

    return {
      message: 'Documento renombrado con éxito',
      data: data.id,
    }
  }

  async moveAsset(
    assetId: string,
    parentId: string,
  ): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.update({
      fileId: assetId,
      addParents: parentId,
      removeParents: this.configService.get('gcp.rootDriveFolderId'),
    })

    return {
      message: 'Documento movido con éxito',
      data: data.id,
    }
  }

  async createFolder(title: string): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [this.configService.get('gcp.rootDriveFolderId')],
      },
    })

    return {
      message: 'Carpeta creada con éxito',
      data: data.id,
    }
  }

  async createFolderByParentId(
    title: string,
    parentId: string,
  ): Promise<ApiResponse<string>> {
    const { data } = await this.drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
    })

    return {
      message: 'Subcarpeta creada con éxito',
      data: data.id,
    }
  }

  async replaceTextOnDocument(
    data: object,
    documentId: string,
  ): Promise<ApiResponse> {
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

      return {
        message: 'Texto reemplazado con éxito',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async remove(assetId: string): Promise<ApiResponse> {
    try {
      await this.drive.files.delete({
        fileId: assetId,
      })

      return {
        message: 'Documento eliminado con éxito',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
