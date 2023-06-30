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
    GetStarStats,
    GetStarsCount
} from './functions/starnft'

export {
    GameAuth
} from './functions/gameplay'
