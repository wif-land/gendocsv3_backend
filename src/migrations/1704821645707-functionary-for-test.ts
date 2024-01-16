import { MigrationInterface, QueryRunner } from 'typeorm'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'

export class FunctionaryForTest1704821645707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const functionaryRepository =
      queryRunner.connection.getRepository(FunctionaryEntity)

    const functionaryForTest = [
      {
        firstName: 'Lenin',
        secondName: 'Lenin',
        firstLastName: 'LEnin',
        secondLastName: 'Lenin',
        outlookEmail: 'lenin@uta.edu.ec',
        personalEmail: 'lenin@gmail.com',
        phoneNumber: '0979424062',
        regularPhoneNumber: '784512',
        dni: '1850994623',
        secondLevelDegree: 'Ingeniero',
        thirdLevelDegree: 'Magister',
        fourthLevelDegree: 'Phd',
        isActive: true,
      },
      {
        firstName: 'Pablo',
        secondName: 'Pablo',
        firstLastName: 'LEnin',
        secondLastName: 'Pablo',
        outlookEmail: 'pablo@uta.edu.ec',
        personalEmail: 'pablo@yahoo.com',
        phoneNumber: '0979424063',
        regularPhoneNumber: '784511',
        dni: '1850994653',
        secondLevelDegree: 'Ingeniero',
        thirdLevelDegree: 'Magister',
        fourthLevelDegree: 'Phd',
        isActive: true,
      },
    ]

    await functionaryRepository.save(functionaryForTest)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const functionaryRepository =
      queryRunner.connection.getRepository(FunctionaryEntity)

    const functionaryForTest = await functionaryRepository.findOne({
      where: { dni: '1850994623' },
    })

    await functionaryRepository.remove(functionaryForTest)
  }
}
