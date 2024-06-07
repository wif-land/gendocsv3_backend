import { MigrationInterface, QueryRunner } from 'typeorm'

export class CouncilsSameTimeFunction1717733178642
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
        CREATE OR REPLACE FUNCTION councils_same_time(
          in_date TIMESTAMP,
          id_functionaries INTEGER[],
          id_students INTEGER[]
        )
        RETURNS TABLE(id INTEGER, date TIMESTAMP)
        LANGUAGE plpgsql
        AS $$
        BEGIN
            RETURN QUERY
            SELECT c.id, c.date
            FROM councils c
            WHERE c.date BETWEEN in_date AND in_date + INTERVAL '60 minutes'
            AND c.id IN (
                SELECT council_id
                FROM council_attendance
                WHERE functionary_id IN (SELECT unnest(id_functionaries))
                AND module_id IS NULL
            )
            OR c.id IN (
                SELECT council_id
                FROM council_attendance
                WHERE council_attendance.student_id IN (SELECT unnest(id_students))
                AND module_id IS NULL
            );
        END;
        $$;
      `

    return queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('DROP FUNCTION councils_same_time')
  }
}
