import { DataSource } from 'typeorm'
import { CreateCouncilDto } from '../dto/create-council.dto'

export abstract class Validator {
  constructor(
    protected errorMessage: string,
    protected dataSource: DataSource,
  ) {}

  public abstract validate(councils: CreateCouncilDto): void
}
