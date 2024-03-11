
export enum ModelAlias {
    FighterWaters = 'FighterWaters',
    BattleShipWaters = 'BattleShipWaters',
    FighterInsects = 'FighterInsects',
    BattleShipInsects = 'BattleShipInsects',
};

/**
 * Parent dirrectory is ./assets/models/
 */
export const MODEL_LOAD_LIST = [
    { alias: ModelAlias.FighterWaters, file: 'battle/FighterAqua.fbx' },
    { alias: ModelAlias.BattleShipWaters, file: 'battle/BattleShipAqua.fbx' },
    { alias: ModelAlias.FighterInsects, file: 'battle/FighterInsect.fbx' },
    { alias: ModelAlias.BattleShipInsects, file: 'battle/BattleShipInsect.fbx' },

];
