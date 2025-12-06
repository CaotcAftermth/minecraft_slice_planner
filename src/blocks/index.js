import { Registry } from '@/core/registry';
import { SPRITES } from '@/render/sprites';
import { keyOf } from '@/core/types';
const simple = (id, icon) => ({ id, palette: { show: true, icon: { src: icon } }, render: () => ({ src: icon }) });
const block = { id: 'block', palette: { show: true, icon: SPRITES.block }, render: () => SPRITES.block, onPlace: ({ x, y }) => [{ id: keyOf(x, y), changes: { block: 'block' } }] };
const redstone_dust = { id: 'redstone_dust', palette: { show: true, icon: SPRITES.redstone_dust }, render: () => SPRITES.redstone_dust, onPlace: ({ x, y }) => [{ id: keyOf(x, y), changes: { block: 'redstone_dust' } }] };
[block, redstone_dust].forEach(d => Registry.register(d));
