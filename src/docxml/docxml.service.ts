import { Injectable } from '@nestjs/common'
import Docx from 'docxml'
@Injectable()
export class DocxmlService {
  async createDocument() {
    return 'hello world'
  }

  async createDocumentByParentId(title: string, parentId: string) {
    return title + parentId
  }

  async createDocumentByParentIdAndCopy(
    title: string,
    parentId: string,
    documentId: string,
  ) {
    return title + parentId + documentId
  }

  async renameAsset(documentId: string, title: string) {
    return title
  }

  async moveAsset(documentId: string, parentId: string) {
    return parentId
  }
}
