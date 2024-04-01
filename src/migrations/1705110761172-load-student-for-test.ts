import { MigrationInterface, QueryRunner } from 'typeorm'
import { Student } from '../students/entities/student.entity'
import { Career } from '../careers/entites/careers.entity'

export class LoadStudentForTest1705110761172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const careerRepository = queryRunner.connection.getRepository(Career)

    const studentRepository = queryRunner.connection.getRepository(Student)

    const careerForTest = {
      internshipHours: 180,
      vinculationHours: 280,
      coordinator: { id: 1 },
      name: 'Ingeniería en Sistemas',
      credits: 240,
      menDegree: 'Ingeniero en Sistemas',
      womenDegree: 'Ingeniera en Sistemas',
      isActive: true,
    }

    await careerRepository.save(careerForTest)

    const studentForTest = {
      firstName: 'Lenin',
      secondName: 'Lenin',
      firstLastName: 'LEnin',
      secondLastName: 'Lenin',
      outlookEmail: 'lenin@uta.edu.ec',
      personalEmail: 'lenin@gmail.com',
      phoneNumber: '0979424062',
      regularPhoneNumber: '784512',
      dni: '1850994625',
      registration: '2001',
      folio: '2004',
      gender: 'Masculino',
      birthdate: new Date('1999-12-12'),
      canton: 'Ibarra',
      approvedCredits: 0,
      isActive: true,
      bachelorDegree: 'Bachiller en Ciencias',
      startStudiesDate: new Date('2021-01-01'),
      career: { id: 1 },
    }

    await studentRepository.save(studentForTest)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const careerRepository = queryRunner.connection.getRepository(Career)
    const studentRepository = queryRunner.connection.getRepository(Student)

    const studentForTest = await studentRepository.findOne({
      where: { dni: '1850994625' },
    })

    const careerForTest = await careerRepository.findOne({
      where: { name: 'Ingeniería en Sistemas' },
    })

    await studentRepository.remove(studentForTest)
    await careerRepository.remove(careerForTest)
  }
}
