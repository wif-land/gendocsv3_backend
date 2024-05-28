import { CouncilEntity } from '../../councils/entities/council.entity'

export const getCouncilPath = (council: CouncilEntity) =>
  `recopilations/${council.module.name}/${council.submoduleYearModule.yearModule.year}/councils/${council.id}-${council.name}`
