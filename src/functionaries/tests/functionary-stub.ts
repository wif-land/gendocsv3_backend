import { BaseStub } from '../../shared/utils/test/base-stub'
import { FunctionaryEntity } from '../entities/functionary.entity'

export class FunctionaryStub extends BaseStub {
  id: number
  firstName: string
  firstLastName: string
  outlookEmail: string

  constructor(props: Partial<FunctionaryEntity> = {}) {
    super()

    this.id = props.id || BaseStub.getRandomId()
    this.firstName = props.firstName || BaseStub.getRandomString()
    this.firstLastName = props.firstLastName || BaseStub.getRandomString()
    this.outlookEmail = props.outlookEmail || BaseStub.getRandomString()
  }
}
