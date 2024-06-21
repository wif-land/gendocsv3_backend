export interface EmailObject {
  text: string
  to: string
  subject: string
  attachment?:
    | {
        data: string
        alternative: boolean
      }[]
    | {
        path: string
        type: string
        name: string
      }[]
}

export abstract class BaseEmailClient {
  abstract initClient(): void
  abstract emailObject(email: EmailObject): void
  abstract sendEmail(email: EmailObject): void
}
