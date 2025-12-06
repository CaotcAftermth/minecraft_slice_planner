const B = import.meta.env.BASE_URL ?? '/';
const sprite = (file) => ({ src: `${B}blocks/${file}` });
export const SPRITES = { block: sprite('block.png'), redstone_dust: sprite('redstone_dust.png') };
