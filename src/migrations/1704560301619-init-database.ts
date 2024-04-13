import { MigrationInterface, QueryRunner } from 'typeorm'
import { UserEntity } from '../users/entities/users.entity'
import { ModuleEntity } from '../modules/entities/modules.entity'
import { SubmoduleEntity } from '../submodules/entities/submodule.entity'
import { SubmoduleModuleEntity } from '../submodules-modules/entities/submodule-module.entity'
import { UserAccessModuleEntity } from '../users-access-modules/entities/user-access-module.entity'

export class InitDatabase1704560301619 implements MigrationInterface {
  name?: string
  transaction?: boolean
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const userRepository = connection.getRepository(UserEntity)
    const moduleRepository = connection.getRepository(ModuleEntity)
    const submoduleRepository = connection.getRepository(SubmoduleEntity)

    const adminUser = [
      {
        id: 1,
        googleEmail: 'gendocsv2@gmail.com',
        outlookEmail: 'ddlm.montenegro@uta.edu.ec',
        role: 'ADMIN',
        isActive: true,
        password:
          '$2a$12$NMywRUK4Ontc9.4Y1YYyyeTU2aUfHdv42wH6c3dls8cveUdpGo1n2',
        firstLastName: 'Montenegro',
        firstName: 'Daniela',
        secondLastName: 'Montenegro',
        secondName: 'Daniela',
      },
    ]

    const modulesToInsert = [
      {
        code: 'FACU',
        name: 'CONSEJO DIRECTIVO',
        isActive: true,
        hasDocuments: true,
        driveId: '1XoGeTqOtnWEg4dFtikDUsPCxDN7K1azp',
        defaultTemplateDriveId: '1yvyjnw88KAkOwMynHV9s1bxWa-YKZ6IOwtcunyeDKdw',
      },
      {
        code: 'SUDE',
        name: 'CONSEJO ACADÉMICO',
        isActive: true,
        hasDocuments: true,
        driveId: '1EPP29edJ0usV_1ai59TYOg8FWQxsJTXy',
        defaultTemplateDriveId: '1VwfM4QSlAtyX4Rnbl_43eE-xgtUrHrKfHpXHsyZUO7s',
      },
      {
        code: 'SIST',
        name: 'SISTEMAS (UNI-TITU)',
        isActive: true,
        hasDocuments: true,
        driveId: '1jUcD9Jycz3FZbpbzkz_OV1KnCJ-nxLPH',
        defaultTemplateDriveId: '1BuZN4MeMnAamaFr16JQUuOYOTYkpm7G1gvDhBmmwMUw',
      },
      {
        code: 'INPA',
        name: 'INDUSTRIAL EN PROCESOS (UNI-TITU)',
        isActive: true,
        hasDocuments: true,
        driveId: '1IBRuw2iYKN3Oc0muHtj7GAjWIaQrgLgz',
        defaultTemplateDriveId: '147QrYn9Cxy6p1qms0HnQD60RF_pkOdSSXzfVrE5ares',
      },
      {
        code: 'ELEC',
        name: 'ELECTRÓNICA Y COMUNICACIONES (UNI-TITU)',
        isActive: true,
        hasDocuments: true,
        driveId: '1VjBtMxtESjT8qTVkzGZGyVqAPjuF-4nE',
        defaultTemplateDriveId: '1VZxygcOXQF8FSgINMzgaJ3yQyDOL4azEKTf6zUt0lis',
      },
      {
        code: 'SOFT',
        name: 'SOFTWARE (UNI-IC)',
        isActive: true,
        hasDocuments: true,
        driveId: '1TNGmMLeAoy-43X2BWW2q_dgT7_lM5rdN',
        defaultTemplateDriveId: '1ZTnzJAaX7wTOMapCev9Acny8EtNfBL-VIqtHy2p0eqU',
      },
      {
        code: 'TECI',
        name: 'TECNOLOGÍA DE INFORMACIÓN (UNI-IC)',
        isActive: true,
        hasDocuments: true,
        driveId: '1CggaJGis8LbqugjXfct6bMpLabSyM92w',
        defaultTemplateDriveId: '1TbrRsX82BspnOFkX6b2CGqZel4q5xWq6GLuBrUHMdjM',
      },
      {
        code: 'TELE',
        name: 'TELECOMUNICACIONES (UNI-IC)',
        isActive: true,
        hasDocuments: true,
        driveId: '1J-IItSC_3OQVYFVeMx_u6unZHrr4VFaY',
        defaultTemplateDriveId: '1Vuu3f6GOGhtRh4Hj2_8_PtkttLaCh9kyELs9igwcOlU',
      },
      {
        code: 'INDS',
        name: 'INDUSTRIAL (UNI-IC)',
        isActive: true,
        hasDocuments: true,
        driveId: '1SoitmaQHSFopOcNva7N401qIEwIpdbii',
        defaultTemplateDriveId: '1iUw4UWmx5KGWgFrPgSdB-cJAgIB4mntSOwanMU0v3c8',
      },
      {
        code: 'ADMIN',
        name: 'ADMINISTRADOR',
        isActive: true,
        hasDocuments: false,
      },
      {
        code: 'COMM',
        name: 'COMUNES',
        isActive: true,
        hasDocuments: true,
        driveId: '1ehTh21yjrDxs5iRAE-p_eSdnGJZ91ioz',
      },
    ]

    const subModulesToInsert = [
      { name: 'Consejos' },
      { name: 'Procesos' },
      { name: 'Documentos' },
      { name: 'Estudiantes' },
      { name: 'Funcionarios' },
      { name: 'Carreras' },
      { name: 'Usuarios' },
      { name: 'Actas de grado' },
      { name: 'Cargos' },
    ]

    const queryRunner2 = connection.createQueryRunner()
    await queryRunner2.connect()
    await queryRunner2.startTransaction()

    await queryRunner2.manager.save(
      adminUser.map((u) => userRepository.create(u as UserEntity)),
    )
    await queryRunner2.manager.save(
      modulesToInsert.map((m) => moduleRepository.create(m)),
    )
    await queryRunner2.manager.save(
      subModulesToInsert.map((m) => submoduleRepository.create(m)),
    )

    await queryRunner2.commitTransaction()

    await queryRunner2.release()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const userRepository = connection.getRepository(UserEntity)
    const moduleRepository = connection.getRepository(ModuleEntity)
    const submoduleRepository = connection.getRepository(SubmoduleEntity)
    const submodulesModuleRepository =
      connection.getRepository(SubmoduleModuleEntity)
    const userAccessModuleRepository =
      connection.getRepository(UserAccessModuleEntity)

    await userRepository.delete({})
    await moduleRepository.delete({})
    await submoduleRepository.delete({})
    await submodulesModuleRepository.delete({})
    await userAccessModuleRepository.delete({})
  }
}
