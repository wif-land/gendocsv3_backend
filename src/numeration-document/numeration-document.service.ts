import { Injectable } from '@nestjs/common'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { UpdateNumerationDocumentDto } from './dto/update-numeration-document.dto'

@Injectable()
export class NumerationDocumentService {
  create(createNumerationDocumentDto: CreateNumerationDocumentDto) {
    return `This action adds a new numerationDocument${createNumerationDocumentDto}`
  }

  findAll() {
    return `This action returns all numerationDocument`
  }

  findOne(id: number) {
    return `This action returns a #${id} numerationDocument`
  }

  update(id: number, updateNumerationDocumentDto: UpdateNumerationDocumentDto) {
    return `This action updates a #${id} numerationDocument${updateNumerationDocumentDto}`
  }

  remove(id: number) {
    return `This action removes a #${id} numerationDocument`
  }
}
