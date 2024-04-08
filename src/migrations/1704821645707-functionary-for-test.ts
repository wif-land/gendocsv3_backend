import { MigrationInterface, QueryRunner } from 'typeorm'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'
import { DegreeEntity } from '../degrees/entities/degree.entity'

export class FunctionaryForTest1704821645707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const degreeRepository = queryRunner.connection.getRepository(DegreeEntity)
    const degreesForTest = [
      {
        abbreviation: 'Ing.',
        maleTitle: 'Ingeniero',
        femaleTitle: 'Ingeniera',
        degreeLevel: '3',
      },
      {
        abbreviation: 'Msc.',
        maleTitle: 'Magister',
        femaleTitle: 'Magister',
        degreeLevel: '4',
      },
      {
        abbreviation: 'Phd.',
        maleTitle: 'Doctor',
        femaleTitle: 'Doctora',
        degreeLevel: '4',
      },
      {
        abbreviation: 'Lic.',
        maleTitle: 'Licenciado',
        femaleTitle: 'Licenciada',
        degreeLevel: '3',
      },
    ]

    await degreeRepository.save(degreesForTest)

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
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 2 },
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
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 3 },
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
