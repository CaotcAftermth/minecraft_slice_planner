import type { BlockId, Cell, Grid, PlaceEvent, Patches, Sprite } from './types'
export type BlockDef = { id: BlockId; palette?: { show:boolean; icon: Sprite }; defaultMeta?: Record<string,unknown>; render(cell:Cell, ctx:{grid:Grid}): Sprite | null; onPlace?(ev:PlaceEvent):Patches; onRotate?(ev:{grid:Grid; id:string}):Patches }
class _Registry{ private map=new Map<BlockId, BlockDef>(); register(def:BlockDef){ if(this.map.has(def.id)) console.warn('[Registry] duplicate', def.id); this.map.set(def.id, def) } get(id:BlockId){ return this.map.get(id) } list(){ return Array.from(this.map.values()) } listPalette(){ return this.list().filter(b=>b.palette?.show) } }
export const Registry=new _Registry()
