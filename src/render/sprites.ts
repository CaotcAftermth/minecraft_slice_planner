import type { Sprite } from '@/core/types'
const B = import.meta.env.BASE_URL ?? '/'
const sprite = (file:string):Sprite => ({ src: `${B}blocks/${file}` })
export const SPRITES = { block: sprite('block.png'), redstone_dust: sprite('redstone_dust.png') }
