export type Orientation = 0 | 90 | 180 | 270
export type BlockId = string
export type CellId = string
export type Cell = { id: CellId; x: number; y: number; block: BlockId | null; rot: Orientation; meta: Record<string, unknown> }
export type Grid = { w: number; h: number; cells: Record<CellId, Cell> }
export type Patch = { id: CellId; changes: Partial<Cell> }
export type Patches = Patch[]
export type PlaceEvent = { grid: Grid; x: number; y: number; region: 'left'|'center'|'right'; modifiers: { shift:boolean; alt:boolean; ctrl:boolean } }
export type Sprite = { src: string; flipX?: boolean; flipY?: boolean }
export const keyOf = (x:number,y:number):CellId => `${x},${y}`
export const clamp = (n:number,a:number,b:number)=> Math.max(a, Math.min(b,n))
export function makeEmptyGrid(w=30,h=20):Grid{ const cells:Record<CellId,Cell>={}; for(let y=0;y<h;y++){ for(let x=0;x<w;x++){ const id=keyOf(x,y); cells[id]={id,x,y,block:null,rot:0,meta:{}} } } return {w,h,cells} }
