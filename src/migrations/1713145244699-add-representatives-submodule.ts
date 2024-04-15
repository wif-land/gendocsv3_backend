import { MigrationInterface, QueryRunner } from 'typeorm'
import { Submodule } from '../submodules/entities/submodule.entity'

export class AddRepresentativesSubmodule1713145244699
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const submoduleRepository = queryRunner.connection.getRepository(Submodule)

    const representivesSubmodule = {
      name: 'Representantes',
    }

    const submodule = await submoduleRepository.save(representivesSubmodule)

    // 1 - 9 stands for the modules IDs
    // eslint-disable-next-line no-magic-numbers
    for (let i = 1; i <= 9; i++) {
      await queryRunner.query(
        `INSERT INTO submodules_modules (submodule_id, module_id) VALUES (${submodule.id}, ${i})`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const submoduleRepository = queryRunner.connection.getRepository(Submodule)
    const representivesSubmodule = await submoduleRepository.findOne({
      where: { name: 'Representantes' },
    })
    await queryRunner.query(
      `DELETE FROM submodules_modules WHERE submodule_id = ${representivesSubmodule.id}`,
    )
    await submoduleRepository.remove(representivesSubmodule)
  }
}
