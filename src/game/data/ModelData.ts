
export enum ModelAlias {
    FighterWaters = 'FighterWaters',
    BattleShipWaters = 'BattleShipWaters',
    FighterInsects = 'FighterInsects',
    BattleShipInsects = 'BattleShipInsects',
    Tower = 'Tower',
};

/**
 * Parent dirrectory is ./assets/models/
 */
export const MODEL_LOAD_LIST = [
    { alias: ModelAlias.FighterWaters, file: 'battle/FighterAqua.fbx' },
    { alias: ModelAlias.BattleShipWaters, file: 'battle/BattleShipAqua.fbx' },
    { alias: ModelAlias.FighterInsects, file: 'battle/FighterInsect.fbx' },
    { alias: ModelAlias.BattleShipInsects, file: 'battle/BattleShipInsect.fbx' },
    { alias: ModelAlias.Tower, file: 'battle/tower_of_insect.fbx' },

];
