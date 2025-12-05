import React from 'react'
import { Registry } from '@/core/registry'
import type { BlockId } from '@/core/types'
type Props={ active:BlockId; setActive:(id:BlockId)=>void; setToolPaint:()=>void }
export default function Palette({active,setActive,setToolPaint}:Props){ const items=Registry.listPalette(); return <div className="palette" aria-label="Block palette">{items.map(b=>(<button key={b.id} className={active===b.id?'active':''} onClick={()=>{ setActive(b.id); setToolPaint() }} title={b.id} aria-label={`Select ${b.id}`}>{b.palette?.icon?.src && (<img className="sprite" src={b.palette.icon.src} alt={b.id}/>)}</button>))}</div> }
