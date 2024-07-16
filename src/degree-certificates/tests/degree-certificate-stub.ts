import { BaseStub } from '../../shared/utils/test/base-stub'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'

export class DegreeCertificateStub extends BaseStub {
  id: number
  auxNumber?: number

  constructor(props: Partial<DegreeCertificateEntity> = {}) {
    super()

    this.id = props.id || BaseStub.getRandomId()
    this.auxNumber = props.auxNumber || BaseStub.getRandomNumber()
  }
}
