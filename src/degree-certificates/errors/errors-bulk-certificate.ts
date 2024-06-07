export class ErrorsBulkCertificate {
  detail: string
  instance: string

  constructor(detail: string, instance: string) {
    this.detail = detail
    this.instance = instance
  }
}
