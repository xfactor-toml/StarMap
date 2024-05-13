import { getAssetImageByKey } from "@/utils/get-asset-image"
import { getAssetNameByKey } from "@/utils/get-asset-name"
import { getAssetRareByKey } from "@/utils/get-asset-rare"

export const mapAssets = (userAssets) => {
  return Object.keys(userAssets).map(key => ({
    name: getAssetNameByKey(key),
    image: getAssetImageByKey(key),
    rare: getAssetRareByKey(key),
    value: userAssets[key]
  })).filter((asset) => {
    return asset.value && asset.name !== 'unknown'
  })
}
