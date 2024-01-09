import { MigrationInterface, QueryRunner } from 'typeorm'
import { YearModule } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModule } from '../year-module/entities/submodule-year-module.entity'

export class LoadDriveMainFolders1704786020632 implements MigrationInterface {
  name?: string
  transaction?: boolean
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
        module: {
          id: 9,
        },
      },
      {
        year: 2024,
        driveId: '1bDL7qiunP_KX9dX_nylRAhFmJP8w9wia',
        isActive: true,
        module: {
          id: 8,
        },
      },
      {
        year: 2024,
        driveId: '1Dzay8xFAfoWFhpMV2PlSyB74iijpO55m',
        isActive: true,
        module: {
          id: 7,
        },
      },
      {
        year: 2024,
        driveId: '105qD4IBAzdUOs7Wc3STtt-b1KZA6umgj',
        isActive: true,
        module: {
          id: 6,
        },
      },
      {
        year: 2024,
        driveId: '1tjONGkFa-3XisVTzy-YoUbldxMvdxQD9',
        isActive: true,
        module: {
          id: 5,
        },
      },
      {
        year: 2024,
        driveId: '1yE4oJIRrN3MWv8RO-K7FZJ2vSvrUZkNW',
        isActive: true,
        module: {
          id: 4,
        },
      },
      {
        year: 2024,
        driveId: '1yaCOa3zMV_6ygjSUEAenIkQ7EwIB49q9',
        isActive: true,
        module: {
          id: 3,
        },
      },
      {
        year: 2024,
        driveId: '1Bd6duD1zeqmW_nySLDB-S-jap7HRH6I-',
        isActive: true,
        module: {
          id: 2,
        },
      },
      {
        year: 2024,
        driveId: '1KjoToTEpeeAVPXuYhGAkhcUEwsJgtz1O',
        isActive: true,
        module: {
          id: 1,
        },
      },
      {
        year: 2024,
        driveId: '1qITJ5A4MrvlNGlY8FSLcAT8jsp2CQpfs',
        isActive: true,
        module: {
          id: 12,
        },
      },
    ]

    const submoduleYearModuleData = [
      {
        name: 'Procesos',
        driveId: '1DJlzVzRCqelc1o4wUNRXp_5swm1ynIa6',
        yearModule: {
          id: 1,
        },
      },
      {
        name: 'Consejos',
        driveId: '1G32DPZYCFVLPwgYKNSDJRAdadw0u-Mhc',
        yearModule: {
          id: 1,
        },
      },
      {
        name: 'Procesos',
        driveId: '1M67kzEjDkmaIlbbaMf9g8petu_w8hLzq',

        yearModule: { id: 2 },
      },
      {
        name: 'Consejos',
        driveId: '19ih-hfLXTOii11ajI1ERnE7J79TMfWq8',
        yearModule: { id: 2 },
      },
      {
        name: 'Procesos',
        driveId: '1ADDu_53Z6uhQtWUiLuPAHdQA4GHQ5cKX',
        yearModule: { id: 3 },
      },
      {
        name: 'Consejos',
        driveId: '1oVhM0eH9KrboOjucHj0gK91S4Zk-rZJ8',
        yearModule: { id: 3 },
      },
      {
        name: 'Procesos',
        driveId: '1tQntjbMg0Pp7Ljxmr0HtSYgGTilY_pFy',
        yearModule: { id: 4 },
      },
      {
        name: 'Consejos',
        driveId: '1S-mhFxAnGurT1F5pdaYWhN3wkEHWqfg5',
        yearModule: { id: 4 },
      },
      {
        name: 'Procesos',
        driveId: '1SE_YzWZxsnGO_JJJpOlQFvQ2aXpQEtnD',
        yearModule: { id: 5 },
      },
      {
        name: 'Consejos',
        driveId: '1mN5zigMN3GtMECSgaftTcMeA9t3-dA_d',
        yearModule: { id: 5 },
      },
      {
        name: 'Procesos',
        driveId: '1vqNH8ysvQGIrX_4aGiu15dw91bLFPdp3',
        yearModule: { id: 6 },
      },
      {
        name: 'Consejos',
        driveId: '1zFhjioI2sXybhMqEKa8uzOzcOeR_s-ok',
        yearModule: { id: 6 },
      },
      {
        name: 'Procesos',
        driveId: '1h1KTA_--5VPh_r6tHQj9ig-hEGf4ko_3',
        yearModule: { id: 7 },
      },
      {
        name: 'Consejos',
        driveId: '1t6HOXcRcas5cuGWneqSn0bP4sVZBRHfP',
        yearModule: { id: 7 },
      },
      {
        name: 'Procesos',
        driveId: '1s920jR4Rbcf2JOK1-eXfMzjmV31zDVar',
        yearModule: { id: 8 },
      },
      {
        name: 'Consejos',
        driveId: '1r080Y4pFOgiODaLGU7YsdKmNmzYPoTun',
        yearModule: { id: 8 },
      },
      {
        name: 'Procesos',
        driveId: '1nOk40HGSAvN6QgbJfin7VFsZCHMpbmKT',
        yearModule: { id: 9 },
      },
      {
        name: 'Consejos',
        driveId: '1nbDFDrOyKQ7d-D5DBZ0c8M3ypEe30lBX',
        yearModule: { id: 9 },
      },
      {
        name: 'Actas de grado',
        driveId: '1EZaatlQsfY0_wc3L0v_P_76uX-u0MHh6',
        yearModule: { id: 10 },
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
