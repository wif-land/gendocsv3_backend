import { IsArray, IsString } from 'class-validator'

export class GradeCellsVariablesDto {
  @IsArray()
  cellsVariables: [string, string][]
  @IsString()
  gradesSheetDriveId: string
}
