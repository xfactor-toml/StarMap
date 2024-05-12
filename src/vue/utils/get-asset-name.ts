import { BoxDataWeb2, BoxItemType } from "~/blockchainTotal/getters/boxesWeb2"

let namesByType: { [key in BoxItemType]: string } = {
  'vrp': 'VRP',
  'biomass': 'Biomass',
  'carbon': 'Carbon',
  'metal': 'Metal',
  'spice': 'Spice',
  'spore': 'Spores',
  'laser': 'Laser',
  'trends': 'Trends'
}

export const getAssetName = (asset: BoxDataWeb2) => {
  return asset.type == 'laser'
    ? `${namesByType[asset.type]} Lv.${asset.laserLevel}`
    : `${namesByType[asset.type]} +${asset.value}`
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
export const getAssetNameByKey = (key: string) => {
  if (key.startsWith('laser')) {
    const [type, level] = key.split('laser')
    return `${namesByType['laser']} Lv.${level}`
  }

  return namesByType[key] || 'unknown'
}
