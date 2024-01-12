import { Injectable } from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DocumentEntity } from './entities/document.entity'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentsRepository: Repository<DocumentEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    try {
      const document = this.documentsRepository.create({
        ...createDocumentDto,
        user: { id: createDocumentDto.userId },
      })

      const savedDocument = await this.documentsRepository.save(document)

      return savedDocument
    } catch (error) {
      throw new Error(error.message)
    }
  }

  findAll() {
    return `This action returns all documents`
  }

  findOne(id: number) {
    return `This action returns a #${id} document`
  }

  remove(id: number) {
    return `This action removes a #${id} document`
  }
}
