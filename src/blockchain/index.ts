export * as CTypes from './types'

export {
    NetworkAuth,
    SubscribeOnAccountChanging
} from './functions/auth'

export {
    GetAllowance,
    GetBalance,
    ApprovePlasma
} from './functions/plasma'

export {
    RequiredPlasmaToApprove,
    GetAllStarData,
    GetSingleStarData,
    CreateNewStar,
    RefuelStar,
    IncreaseStarLevel,
    GetCreationCost,
    GetStarsCount
} from './functions/starnft'
