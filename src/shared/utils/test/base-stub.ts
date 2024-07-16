export class BaseStub {
  static getRandomId = (): number => Math.floor(Math.random() * 1000)

  static getRandomDate = (): Date => new Date()

  static getRandomBoolean = (): boolean => Math.random() < 0.5

  static getRandomString = (): string => Math.random().toString(36).substring(7)

  static getRandomEnum = (enumValues: any): any => {
    const values = Object.values(enumValues)
    return values[Math.floor(Math.random() * values.length)]
  }

  static getRandomEntity = (entity: any): any => {
    const instance = new entity()
    Object.keys(instance).forEach((key) => {
      if (typeof instance[key] === 'number') {
        instance[key] = BaseStub.getRandomId()
      } else if (typeof instance[key] === 'string') {
        instance[key] = BaseStub.getRandomString()
      } else if (typeof instance[key] === 'boolean') {
        instance[key] = BaseStub.getRandomBoolean()
      } else if (instance[key] instanceof Date) {
        instance[key] = BaseStub.getRandomDate()
      } else if (instance[key] instanceof Object) {
        instance[key] = BaseStub.getRandomEntity(instance[key].constructor)
      }
    })
    return instance
  }

  static getRandomNumber = (): number => Math.floor(Math.random() * 1000)
}
