export class DtoUtils {
  static messageError(error: string, variables: unknown): string {
    if (!error) return null
    return error
      ? error.replace(
          /{min}|{field}|{required}|{minLength}|{maxLength}/gi,
          (matched) => variables[matched],
        )
      : null
  }
}
