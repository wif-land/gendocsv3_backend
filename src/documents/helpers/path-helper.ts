import { CouncilEntity } from '../../councils/entities/council.entity'
import { YearModuleEntity } from '../../year-module/entities/year-module.entity'

export const getCouncilPath = (council: CouncilEntity) =>
  `recopilations/${council.module.name}/${council.submoduleYearModule.yearModule.year}/councils/${council.id}-${council.name}`

export const getYearModulePath = (yearModule: YearModuleEntity) =>
  `recopilations/${yearModule.module.name}/${yearModule.year}`
