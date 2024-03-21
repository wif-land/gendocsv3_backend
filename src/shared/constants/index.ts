const COMMON_VALIDATION_ERRORS = {
  isArray: "Campo '{field}' debe ser un array",
  arrayMinLength: "Campo '{field}' debe tener al menos {minLength} elementos",
  isConfirmation: "Se esperaba una confirmación en el campo '{field}'",
  isNumber: "Se esperaba un número en el campo '{field}'",
  notFound: 'No se encontró',
  required: "Se espera un dato en el campo '{field}'",
  isEnum: "Campo '{field}' no cumple con la homologación",
  minLength: "Campo '{field}' debe tener al menos {minLength} caracteres'",
  maxLength: "Campo '{field}' debe tener como máximo {maxLength} caracteres",
  email: "Campo '{field}' no tiene una estructura válida",
  isString: "Se espera caracteres alfabéticos en el campo '{field}'",
  isNumberString: "Se espera caracteres alfanuméricos en el campo '{field}'",
  isBoolean: "Se espera true o false en el campo '{field}'",
}

export const VALIDATION_ERROR_MESSAGES = {
  ...COMMON_VALIDATION_ERRORS,
}
