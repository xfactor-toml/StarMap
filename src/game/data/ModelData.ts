
export enum ModelAlias {
    FighterAqua = 'FighterAqua',
    BattleShipAqua = 'BattleShipAqua',
};

/**
 * Parent dirrectory is ./assets/models/
 */
export const MODEL_LOAD_LIST = [
    { alias: ModelAlias.FighterAqua, file: 'battle/FighterAqua.fbx' },
    { alias: ModelAlias.BattleShipAqua, file: 'battle/BattleShipAqua.fbx' },

];
