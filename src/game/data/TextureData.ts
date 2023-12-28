
export enum TextureAlias {
    starPoint = 'starPoint',
    galaxySprite = 'galaxySprite',
    star_03 = `star_03`,
    Ship1Color = `ship1Color`,

};

/**
 * Parent dirrectory is ./assets/
 */
export const TEXTURE_LOAD_LIST = [
    { alias: TextureAlias.starPoint, file: 'starPoint_128.png' },
    { alias: TextureAlias.galaxySprite, file: 'galaxySprite.webp' },
    { alias: TextureAlias.star_03, file: 'sprites/stars/star_03.png' },
    { alias: TextureAlias.Ship1Color, file: 'models/battle/space11/textures/spch3_Material_BaseColor.jpg' },
];
