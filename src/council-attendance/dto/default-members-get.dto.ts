export class GetDefaultMembers {
  public id: number
  public positionOrder: number
  public positionName: string
  public isStudent: boolean
  public member: object

  constructor(
    id: number,
    positionOrder: number,
    positionName: string,
    member: { student?: object; functionary?: object },
  ) {
    this.id = id
    this.positionOrder = positionOrder
    this.positionName = positionName
    this.isStudent = !!member.student
    this.member = member.student || member.functionary
  }
}
