import { CouncilEntity } from '../../councils/entities/council.entity'
import { YearModuleEntity } from '../../year-module/entities/year-module.entity'
import * as path from 'path'

const projectPath = path.resolve(__dirname, '../../../')

export const getCouncilPath = (council: CouncilEntity) =>
  `${projectPath}/storage/recopilations/${council.module.name}/${council.submoduleYearModule.yearModule.year}/councils/${council.id}-${council.name}`

export const getYearModulePath = (yearModule: YearModuleEntity) =>
  `${projectPath}/storage/recopilations/${yearModule.module.name}/${yearModule.year}`

export const getProjectPath = () => projectPath
