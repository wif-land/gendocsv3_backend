import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReportTemplate1717741101554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE modules
        SET report_template_drive_id = '1k1u6vFfZzg7zr4C2vX2p1E3bGyJ6lC5'
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
