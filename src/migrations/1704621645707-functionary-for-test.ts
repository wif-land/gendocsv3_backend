import { MigrationInterface, QueryRunner } from 'typeorm'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'
import { DegreeEntity } from '../degrees/entities/degree.entity'

export class FunctionaryForTest1704621645707 implements MigrationInterface {
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
      {
        firstName: 'Elsa',
        secondName: 'Pilar',
        firstLastName: 'Urrutia',
        secondLastName: 'Urrutia',
        outlookEmail: 'elsa@uta.edu.ec',
        personalEmail: 'elsa@yahoo.com',
        phoneNumber: '0979424064',
        regularPhoneNumber: '784512',
        dni: '1850994654',
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 3 },
        isActive: true,
      },
      {
        firstName: 'Juan',
        secondName: 'Juan',
        firstLastName: 'Juan',
        secondLastName: 'Juan',
        outlookEmail: 'juan@uta.edu.ec',
        personalEmail: 'juan@gmail.com',
        phoneNumber: '0979424065',
        regularPhoneNumber: '784513',
        dni: '1850994655',
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 4 },
      },
      {
        firstName: 'Carlos',
        secondName: 'Carlos',
        firstLastName: 'Carlos',
        secondLastName: 'Carlos',
        outlookEmail: 'carlos@uta.edu.ec',
        personalEmail: 'carlos@gmail.com',
        phoneNumber: '0979424066',
        regularPhoneNumber: '784514',
        dni: '1850994656',
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 4 },
      },
      {
        firstName: 'Luis',
        secondName: 'Luis',
        firstLastName: 'Luis',
        secondLastName: 'Luis',
        outlookEmail: 'luis@uta.edu.ec',
        personalEmail: 'luis@gmail.com',
        phoneNumber: '0979424067',
        regularPhoneNumber: '784515',
        dni: '1850994657',
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 4 },
      },
      {
        firstName: 'Jose',
        secondName: 'Jose',
        firstLastName: 'Jose',
        secondLastName: 'Jose',
        outlookEmail: 'jose@uta.edu.ec',
        personalEmail: 'jose@gmail.com',
        phoneNumber: '0979424068',
        regularPhoneNumber: '784516',
        dni: '1850994658',
        thirdLevelDegree: { id: 1 },
        fourthLevelDegree: { id: 4 },
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
