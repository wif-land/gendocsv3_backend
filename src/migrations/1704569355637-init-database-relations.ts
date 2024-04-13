import { MigrationInterface, QueryRunner } from 'typeorm'
import { UserAccessModuleEntity } from '../users-access-modules/entities/user-access-module.entity'
import { SubmoduleModuleEntity } from '../submodules-modules/entities/submodule-module.entity'

export class InitDatabaseRelations1704569355637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const submodulesModuleRepository =
      connection.getRepository(SubmoduleModuleEntity)
    const userAccessModuleRepository =
      connection.getRepository(UserAccessModuleEntity)

    const modulesAndSubModulesRelationsToInsert = [
      { moduleId: 1, submoduleId: 1 },
      { submoduleId: 2, moduleId: 1 },
      { submoduleId: 3, moduleId: 1 },
      { submoduleId: 1, moduleId: 2 },
      { submoduleId: 2, moduleId: 2 },
      { submoduleId: 3, moduleId: 2 },
      { submoduleId: 1, moduleId: 3 },
      { submoduleId: 2, moduleId: 3 },
      { submoduleId: 3, moduleId: 3 },
      { submoduleId: 1, moduleId: 4 },
      { submoduleId: 2, moduleId: 4 },
      { submoduleId: 3, moduleId: 4 },
      { submoduleId: 1, moduleId: 5 },
      { submoduleId: 2, moduleId: 5 },
      { submoduleId: 3, moduleId: 5 },
      { submoduleId: 1, moduleId: 6 },
      { submoduleId: 2, moduleId: 6 },
      { submoduleId: 3, moduleId: 6 },
      { submoduleId: 1, moduleId: 7 },
      { submoduleId: 2, moduleId: 7 },
      { submoduleId: 3, moduleId: 7 },
      { submoduleId: 1, moduleId: 8 },
      { submoduleId: 2, moduleId: 8 },
      { submoduleId: 3, moduleId: 8 },
      { submoduleId: 1, moduleId: 9 },
      { submoduleId: 2, moduleId: 9 },
      { submoduleId: 3, moduleId: 9 },
      { submoduleId: 5, moduleId: 10 },
      { submoduleId: 6, moduleId: 10 },
      { submoduleId: 7, moduleId: 10 },
      { submoduleId: 9, moduleId: 10 },
      { submoduleId: 8, moduleId: 11 },
      { submoduleId: 4, moduleId: 11 },
    ]

    const userAccessModuleToInsert = [
      { userId: 1, moduleId: 1 },
      { userId: 1, moduleId: 2 },
      { userId: 1, moduleId: 3 },
      { userId: 1, moduleId: 4 },
      { userId: 1, moduleId: 5 },
      { userId: 1, moduleId: 6 },
      { userId: 1, moduleId: 7 },
      { userId: 1, moduleId: 8 },
      { userId: 1, moduleId: 9 },
      { userId: 1, moduleId: 10 },
      { userId: 1, moduleId: 11 },
    ]

    const queryRunner2 = connection.createQueryRunner()
    await queryRunner2.connect()
    await queryRunner2.startTransaction()

    await queryRunner2.manager.save(
      modulesAndSubModulesRelationsToInsert.map((m) =>
        submodulesModuleRepository.create(m),
      ),
    )
    await queryRunner2.manager.save(
      userAccessModuleToInsert.map((m) => userAccessModuleRepository.create(m)),
    )

    await queryRunner2.commitTransaction()
    await queryRunner2.release()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const submodulesModuleRepository =
      connection.getRepository(SubmoduleModuleEntity)
    const userAccessModuleRepository =
      connection.getRepository(UserAccessModuleEntity)

    await submodulesModuleRepository.delete({})
    await userAccessModuleRepository.delete({})
  }
}
