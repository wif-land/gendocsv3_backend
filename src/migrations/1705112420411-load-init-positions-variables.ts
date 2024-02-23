import { MigrationInterface, QueryRunner } from 'typeorm'
import { PositionEntity } from '../positions/entities/position.entity'
import { VariableEntity } from '../variables/entities/variable.entity'

export class LoadInitPositionsVariables1705112420411
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const positionsRepository = queryRunner.connection.getRepository(PositionEntity)
    const variablesRepository =
      queryRunner.connection.getRepository(VariableEntity)

    const variableForTest = [
      {
        variable: '{{PRUEBA}}',
        name: 'Horas de vinculación',
        value: '280',
      },
      {
        variable: '{{SALUDO}}',
        name: 'SALUDO',
        value: 'HELLO FROM LENIN',
      },
    ]

    await variablesRepository.save(variableForTest)

    const positionForTest = [
      {
        variable: '{{COOR_SISTEMAS}}',
        name: 'Docente de la Universidad Técnica de Ambato',
        functionary: { id: 1 },
      },
      {
        variable: '{{COOR_SOFTWARE}}',
        name: 'Docente de la Universidad Técnica de Ambato',
        functionary: { id: 2 },
      },
    ]

    await positionsRepository.save(positionForTest)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const positionsRepository = queryRunner.connection.getRepository(PositionEntity)
    const variablesRepository =
      queryRunner.connection.getRepository(VariableEntity)

    const variableForTest = await variablesRepository.findOne({
      where: { variable: '{{PRUEBA}}' },
    })

    const positionForTest = await positionsRepository.findOne({
      where: { variable: '{{COOR_SISTEMAS}}' },
    })

    await variablesRepository.remove(variableForTest)
    await positionsRepository.remove(positionForTest)
  }
}
