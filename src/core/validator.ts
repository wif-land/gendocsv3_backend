import { DataSource } from 'typeorm'

export abstract class Validator<T> {
  constructor(
    protected errorMessage: string,
    protected dataSource: DataSource,
  ) {}

  public abstract validate(data: T): void
}
