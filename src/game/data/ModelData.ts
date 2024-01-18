
export enum ModelAlias {
    FighterAqua = 'FighterAqua',
    BattleShipAqua = 'BattleShipAqua',
    FighterInsects = 'FighterInsects',
    BattleShipInsects = 'BattleShipInsects',
};

/**
 * Parent dirrectory is ./assets/models/
 */
export const MODEL_LOAD_LIST = [
    { alias: ModelAlias.FighterAqua, file: 'battle/FighterAqua.fbx' },
    { alias: ModelAlias.BattleShipAqua, file: 'battle/BattleShipAqua.fbx' },
    { alias: ModelAlias.FighterInsects, file: 'battle/FighterInsect.fbx' },
    { alias: ModelAlias.BattleShipInsects, file: 'battle/BattleShipInsect.fbx' },

];
