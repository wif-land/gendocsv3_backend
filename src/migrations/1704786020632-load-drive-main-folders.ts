import { MigrationInterface, QueryRunner } from 'typeorm'
import { YearModule } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModule } from '../year-module/entities/submodule-year-module.entity'

export class LoadDriveMainFolders1704786020632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const yearModuleRepository = connection.getRepository(YearModule)
    const submoduleYearModuleRepository =
      connection.getRepository(SubmoduleYearModule)

    const yearModuleData = [
      {
        year: 2024,
        driveId: '1cBw8ldhcEP8cfXmr9MhZZlDcAiq9KwNv',
        isActive: true,
        moduleId: 9,
      },
      {
        year: 2024,
        driveId: '1bDL7qiunP_KX9dX_nylRAhFmJP8w9wia',
        isActive: true,
        moduleId: 8,
      },
      {
        year: 2024,
        driveId: '1Dzay8xFAfoWFhpMV2PlSyB74iijpO55m',
        isActive: true,
        moduleId: 7,
      },
      {
        year: 2024,
        driveId: '105qD4IBAzdUOs7Wc3STtt-b1KZA6umgj',
        isActive: true,
        moduleId: 6,
      },
      {
        year: 2024,
        driveId: '1tjONGkFa-3XisVTzy-YoUbldxMvdxQD9',
        isActive: true,
        moduleId: 5,
      },
      {
        year: 2024,
        driveId: '1yE4oJIRrN3MWv8RO-K7FZJ2vSvrUZkNW',
        isActive: true,
        moduleId: 4,
      },
      {
        year: 2024,
        driveId: '1yaCOa3zMV_6ygjSUEAenIkQ7EwIB49q9',
        isActive: true,
        moduleId: 3,
      },
      {
        year: 2024,
        driveId: '1Bd6duD1zeqmW_nySLDB-S-jap7HRH6I-',
        isActive: true,
        moduleId: 2,
      },
      {
        year: 2024,
        driveId: '1KjoToTEpeeAVPXuYhGAkhcUEwsJgtz1O',
        isActive: true,
        moduleId: 1,
      },
      {
        year: 2024,
        driveId: '1qITJ5A4MrvlNGlY8FSLcAT8jsp2CQpfs',
        isActive: true,
        moduleId: 12,
      },
    ]

    const submoduleYearModuleData = [
      {
        name: 'Procesos',
        driveId: '1DJlzVzRCqelc1o4wUNRXp_5swm1ynIa6',
        yearModuleId: 1,
      },
      {
        name: 'Consejos',
        driveId: '1G32DPZYCFVLPwgYKNSDJRAdadw0u-Mhc',
        yearModuleId: 1,
      },
      {
        name: 'Procesos',
        driveId: '1M67kzEjDkmaIlbbaMf9g8petu_w8hLzq',
        yearModuleId: 2,
      },
      {
        name: 'Consejos',
        driveId: '19ih-hfLXTOii11ajI1ERnE7J79TMfWq8',
        yearModuleId: 2,
      },
      {
        name: 'Procesos',
        driveId: '1ADDu_53Z6uhQtWUiLuPAHdQA4GHQ5cKX',
        yearModuleId: 3,
      },
      {
        name: 'Consejos',
        driveId: '1oVhM0eH9KrboOjucHj0gK91S4Zk-rZJ8',
        yearModuleId: 3,
      },
      {
        name: 'Procesos',
        driveId: '1tQntjbMg0Pp7Ljxmr0HtSYgGTilY_pFy',
        yearModuleId: 4,
      },
      {
        name: 'Consejos',
        driveId: '1S-mhFxAnGurT1F5pdaYWhN3wkEHWqfg5',
        yearModuleId: 4,
      },
      {
        name: 'Procesos',
        driveId: '1SE_YzWZxsnGO_JJJpOlQFvQ2aXpQEtnD',
        yearModuleId: 5,
      },
      {
        name: 'Consejos',
        driveId: '1mN5zigMN3GtMECSgaftTcMeA9t3-dA_d',
        yearModuleId: 5,
      },
      {
        name: 'Procesos',
        driveId: '1vqNH8ysvQGIrX_4aGiu15dw91bLFPdp3',
        yearModuleId: 6,
      },
      {
        name: 'Consejos',
        driveId: '1zFhjioI2sXybhMqEKa8uzOzcOeR_s-ok',
        yearModuleId: 6,
      },
      {
        name: 'Procesos',
        driveId: '1h1KTA_--5VPh_r6tHQj9ig-hEGf4ko_3',
        yearModuleId: 7,
      },
      {
        name: 'Consejos',
        driveId: '1t6HOXcRcas5cuGWneqSn0bP4sVZBRHfP',
        yearModuleId: 7,
      },
      {
        name: 'Procesos',
        driveId: '1s920jR4Rbcf2JOK1-eXfMzjmV31zDVar',
        yearModuleId: 8,
      },
      {
        name: 'Consejos',
        driveId: '1r080Y4pFOgiODaLGU7YsdKmNmzYPoTun',
        yearModuleId: 8,
      },
      {
        name: 'Procesos',
        driveId: '1nOk40HGSAvN6QgbJfin7VFsZCHMpbmKT',
        yearModuleId: 9,
      },
      {
        name: 'Consejos',
        driveId: '1nbDFDrOyKQ7d-D5DBZ0c8M3ypEe30lBX',
        yearModuleId: 9,
      },
      {
        name: 'Actas de grado',
        driveId: '1EZaatlQsfY0_wc3L0v_P_76uX-u0MHh6',
        yearModuleId: 10,
      },
    ]

    const queryRunner2 = connection.createQueryRunner()
    await queryRunner2.connect()
    await queryRunner2.startTransaction()

    await queryRunner2.manager.save(
      yearModuleData.map((m) => yearModuleRepository.create(m)),
    )
    await queryRunner2.manager.save(
      submoduleYearModuleData.map((m) =>
        submoduleYearModuleRepository.create(m),
      ),
    )

    await queryRunner2.commitTransaction()
    await queryRunner2.release()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const yearModuleRepository = connection.getRepository(YearModule)
    const submoduleYearModuleRepository =
      connection.getRepository(SubmoduleYearModule)

    await yearModuleRepository.delete({})
    await submoduleYearModuleRepository.delete({})
  }
}
