import { BoxDataWeb2, BoxItemType } from "~/blockchainTotal/getters/boxesWeb2"

const iconByType: { [key in BoxItemType]: string } = {
  'vrp': '/gui/images/icons/coins.png',
  'biomass': '/gui/images/icons/biomass.png',
  'carbon': '/gui/images/icons/hydrocarbon.png',
  'metal': '/gui/images/icons/metal.png',
  'spice': '/gui/images/icons/spice.png',
  'spore': '/gui/images/icons/spores.png',
  'laser': '/gui/images/icons/laser-red.png',
  'trends': '/gui/images/icons/coins.png'
}

const iconByLaserLevel = {
  0: '/gui/images/icons/laser-red.png',
  1: '/gui/images/icons/laser-white.png',
  2: '/gui/images/icons/laser-violet.png'
}

export const getAssetImage = (asset: BoxDataWeb2) => {
  return asset.type == 'laser' ? iconByLaserLevel[asset.laserLevel] : iconByType[asset.type]
}

// biomass
// carbon
// laser1
// laser2
// laser3
// metal
// spice
// spore
// token
// trends
export const getAssetImageByKey = (key: string) => {
  if (key.startsWith('laser')) {
    const [type, level] = key.split('laser')
    return iconByLaserLevel[Number(level) - 1]
  }

  return iconByType[key] || ''
}
