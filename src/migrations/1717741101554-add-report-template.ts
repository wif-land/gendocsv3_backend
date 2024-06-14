import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReportTemplate1717741101554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE modules
        SET report_template_drive_id = '19YNc7_uGgSvbiKE5X7aA9LWNouAlXsCjEGosWBsJuLI'
        WHERE code = 'COMM'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE modules
        SET report_template_drive_id = NULL
        WHERE code = 'COMM'
    `)
  }
}
