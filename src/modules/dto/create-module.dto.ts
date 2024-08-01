import { Optional } from '@nestjs/common'
import { IsNotEmpty } from 'class-validator'

export class CreateModuleDTO {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string

  @IsNotEmpty()
  hasDocuments: boolean

  @Optional()
  defaultTemplateDriveId?: string

  @Optional()
  separatorTemplateDriveId?: string

  @Optional()
  compilationTemplateDriveId?: string

  @Optional()
  reportTemplateDriveId?: string
}
