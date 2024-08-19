import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * This migration is responsible for adding the drive_id column to the submodules_modules table, taking it from submodule_year_module
 * @author: Pablo Villacres
 */
export class AssingDriveIdSubmoduleModule1724026626643
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connect()
    await queryRunner.startTransaction()

    const submodulesModules = await queryRunner.query(
      `SELECT * FROM submodules_modules`,
    )

    await (async () => {
      ;(submodulesModules as Array<any>).map(async (submoduleModule) => {
        if (submoduleModule.submodule_id === 2) {
          await queryRunner.query(
            `UPDATE submodules_modules SET drive_id = (SELECT drive_id FROM submodule_year_module 
            where submodule_year_module."name"='Procesos' and year_module_id = (select id from year_module as y where y.module_id = ${submoduleModule.module_id})
            )
             WHERE submodule_id = ${submoduleModule.submodule_id} AND module_id = ${submoduleModule.module_id}`,
          )
        }
      })
    })()

    await queryRunner.commitTransaction()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connect()
    await queryRunner.startTransaction()

    await queryRunner.query(
      `UPDATE submodules_modules SET drive_id = NULL WHERE submodule_id = 2`,
    )

    await queryRunner.commitTransaction()
  }
}
