import { DataSource } from 'typeorm'

export class TypeOrmHelper {
  static setup = async (
    fixtures: unknown,
    dataSource: DataSource,
  ): Promise<void> => {
    for (const table of Object.keys(fixtures)) {
      const entity = fixtures[table].entity
      for (const item of fixtures[table].data) {
        await dataSource.getRepository(entity).save(item)
      }
    }
  }
}
