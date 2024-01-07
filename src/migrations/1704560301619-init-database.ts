import { MigrationInterface, QueryRunner } from 'typeorm'
import { User } from '../users/entities/users.entity'
import { Module } from '../modules/entities/modules.entity'
import { Submodule } from '../submodules/entities/submodule.entity'
import { SubmodulesModule } from '../submodules-modules/entities/submodule-module.entity'
import { UserAccessModule } from '../users-access-modules/entities/user-access-module.entity'

export class InitDatabase1704560301619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connection = queryRunner.connection

    const userRepository = connection.getRepository(User)
    const moduleRepository = connection.getRepository(Module)
    const submoduleRepository = connection.getRepository(Submodule)

    const adminUser = [
      {
        id: 1,
        googleEmail: 'gendocsv2@gmail.com',
        outlookEmail: 'ddlm.montenegro@uta.edu.ec',
        roles: ['ADMIN'],
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
      },
      {
        code: 'SUDE',
        name: 'CONSEJO ACADÉMICO',
      },
      {
        code: 'SIST',
        name: 'SISTEMAS (UNI-TITU)',
      },
      {
        code: 'INPA',
        name: 'INDUSTRIAL EN PROCESOS (UNI-TITU)',
      },
      {
        code: 'ELEC',
        name: 'ELECTRÓNICA Y COMUNICACIONES (UNI-TITU)',
      },
      {
        code: 'SOFT',
        name: 'SOFTWARE (UNI-IC)',
      },
      {
        code: 'TECI',
        name: 'TECNOLOGÍA DE INFORMACIÓN (UNI-IC)',
      },
      {
        code: 'TELE',
        name: 'TELECOMUNICACIONES (UNI-IC)',
      },
      {
        code: 'INDS',
        name: 'INDUSTRIAL (UNI-IC)',
      },
      {
        code: 'ESTU',
        name: 'ESTUDIANTES',
      },
      {
        code: 'ADMIN',
        name: 'ADMINISTRADOR',
      },
    ]

    const subModulesToInsert = [
      { name: 'Buscar' },
      { name: 'Consejos' },
      { name: 'Procesos' },
      { name: 'Documentos' },
      { name: 'Estudiantes' },
      { name: 'Funcionarios' },
      { name: 'Carreras' },
      { name: 'Usuarios' },
      { name: 'Actas de grado' },
      { name: 'Historial' },
      { name: 'Cargos' },
    ]

    const queryRunner2 = connection.createQueryRunner()
    await queryRunner2.connect()
    await queryRunner2.startTransaction()

    await queryRunner2.manager.save(
      adminUser.map((u) => userRepository.create(u as User)),
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

    const userRepository = connection.getRepository(User)
    const moduleRepository = connection.getRepository(Module)
    const submoduleRepository = connection.getRepository(Submodule)
    const submodulesModuleRepository =
      connection.getRepository(SubmodulesModule)
    const userAccessModuleRepository =
      connection.getRepository(UserAccessModule)

    await userRepository.delete({})
    await moduleRepository.delete({})
    await submoduleRepository.delete({})
    await submodulesModuleRepository.delete({})
    await userAccessModuleRepository.delete({})
  }
}
