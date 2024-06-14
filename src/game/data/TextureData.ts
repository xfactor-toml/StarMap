
export enum TextureAlias {
    starPoint = 'starPoint',
    galaxySprite = 'galaxySprite',
    star_03 = `star_03`,
    fieldCell = `fieldCell`,
    planetDirrectionArea = `planetDirrectionArea`,
    planet0_256 = `planet0_256`,
    particleCircle = 'particleCircle',
    particleWhiteCircle = 'particleWhiteCircle',
    rocketTargetAim = 'rocketTargetAim'
};

/**
 * Parent dirrectory is ./assets/
 */
export const TEXTURE_LOAD_LIST = [
    { alias: TextureAlias.starPoint, file: 'starPoint_128.png' },
    { alias: TextureAlias.galaxySprite, file: 'galaxySprite.webp' },
    { alias: TextureAlias.star_03, file: 'sprites/stars/star_03.png' },
    { alias: TextureAlias.fieldCell, file: 'sprites/battle/cell.png' },
    { alias: TextureAlias.planetDirrectionArea, file: 'sprites/battle/area.png' },
    { alias: TextureAlias.planet0_256, file: 'sprites/planets/0_256.jpg' },
    { alias: TextureAlias.particleCircle, file: 'particles/circle.png' },
    { alias: TextureAlias.particleWhiteCircle, file: 'particles/whiteCircle2.png' },
    { alias: TextureAlias.rocketTargetAim, file: 'sprites/battle/missileTarget_512.png' },
];
