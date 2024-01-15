
export enum TextureAlias {
    starPoint = 'starPoint',
    galaxySprite = 'galaxySprite',
    star_03 = `star_03`,
    ship1Color = `ship1Color`,
    fieldCell = `fieldCell`,
    planetDirrectionArea = `planetDirrectionArea`,
    planet0_256 = `planet0_256`,

};

/**
 * Parent dirrectory is ./assets/
 */
export const TEXTURE_LOAD_LIST = [
    { alias: TextureAlias.starPoint, file: 'starPoint_128.png' },
    { alias: TextureAlias.galaxySprite, file: 'galaxySprite.webp' },
    { alias: TextureAlias.star_03, file: 'sprites/stars/star_03.png' },
    { alias: TextureAlias.ship1Color, file: 'models/battle/space11/textures/spch3_Material_BaseColor.jpg' },
    { alias: TextureAlias.fieldCell, file: 'sprites/battle/cell.png' },
    { alias: TextureAlias.planetDirrectionArea, file: 'sprites/battle/area.png' },
    { alias: TextureAlias.planet0_256, file: 'sprites/planets/0_256.jpg' },
];
