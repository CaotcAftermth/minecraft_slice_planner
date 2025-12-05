import React, { useRef, useState } from 'react'
import { makeEmptyGrid, keyOf, type Grid, type Sprite } from '@/core/types'
import { useHistory } from '@/core/history'
import { Registry } from '@/core/registry'
import '@/blocks'
import Palette from '@/ui/Palette'
import GridView from '@/ui/GridView'
import Inspector from '@/ui/Inspector'
import SettingsModal from '@/ui/SettingsModal'
export default function App(){
  const { state:grid, commit, undo, redo } = useHistory<Grid>(makeEmptyGrid(30,20))
  const [tool,setTool]=useState<'paint'|'select'|'erase'>('paint')
  const [active,setActive]=useState<string>('block')
  const [selection,setSelection]=useState<string|null>(null)
  const [cellSize,setCellSize]=useState(28)
  const [showGrid,setShowGrid]=useState(true)
  const [settingsOpen,setSettingsOpen]=useState(false)
  function applyPatches(patches:{id:string; changes:Partial<any>}[]){ const next:Grid={...grid, cells:{...grid.cells}}; for(const p of patches){ next.cells[p.id]={...next.cells[p.id], ...p.changes} } commit(next) }
  function getRegion(e:React.MouseEvent, x:number):'left'|'center'|'right'{ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); const relX=e.clientX-rect.left; const cellW=rect.width/grid.w; const cx=relX - x*cellW; if(cx<cellW/3) return 'left'; if(cx>2*cellW/3) return 'right'; return 'center' }
  function onPaintAt(x:number,y:number,e?:React.MouseEvent){ if(x<0||y<0||x>=grid.w||y>=grid.h) return; const id=keyOf(x,y); if(tool==='erase' || (e && e.button===2)){ applyPatches([{id, changes:{block:null, meta:{}}}]); return } if(tool==='select'){ setSelection(id); return } const def=Registry.get(active as any); const region=e?getRegion(e,x):'center'; const patches=def?.onPlace ? def.onPlace({ grid,x,y,region, modifiers:{ shift:!!e?.shiftKey, alt:!!e?.altKey, ctrl: !!(e && (e.ctrlKey||e.metaKey)) }}) : [{id, changes:{block:active}}]; applyPatches(patches as any) }
  function getSprite(x:number,y:number):Sprite|null{ const c=grid.cells[keyOf(x,y)]; if(!c||!c.block) return null; const def=Registry.get(c.block); return def?.render(c,{grid}) ?? null }
  const fileRef=useRef<HTMLInputElement|null>(null)
  function toJSON(){ return { version:1, w:grid.w, h:grid.h, cells:Object.values(grid.cells).filter(c=>c.block!==null).map(({id,x,y,block,rot,meta})=>({id,x,y,block,rot,meta})) } }
  async function copyJSON(){ await navigator.clipboard.writeText(JSON.stringify(toJSON(), null, 2)) }
  function downloadJSON(){ const blob=new Blob([JSON.stringify(toJSON(),null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='slice.json'; a.click(); URL.revokeObjectURL(url) }
  function loadFromFile(file:File){ const reader=new FileReader(); reader.onload=()=>{ try{ const parsed=JSON.parse(String(reader.result)); const g=makeEmptyGrid(parsed.w ?? grid.w, parsed.h ?? grid.h); for(const c of parsed.cells ?? []){ const id=keyOf(c.x,c.y); g.cells[id]={ id, x:c.x, y:c.y, block:c.block, rot:c.rot ?? 0, meta:c.meta ?? {} } } commit(g) }catch{ alert('Invalid file') } }; reader.readAsText(file) }
  return (<div className="app">
    <div className="card"><h3>Palette & Controls</h3><div className="content">
      <Palette active={active} setActive={setActive} setToolPaint={()=>setTool('paint')} />
      <div style={{height:12}}/>
      <div className="toolbar"><button onClick={()=>setTool('paint')} className={tool==='paint'?'active':''}>Paint</button><button onClick={()=>setTool('select')} className={tool==='select'?'active':''}>Select</button><button onClick={()=>setTool('erase')} className={tool==='erase'?'active':''}>Erase</button><button onClick={undo}>Undo</button><button onClick={redo}>Redo</button></div>
      <div style={{height:12}}/>
      <div className="row" style={{justifyContent:'space-between'}}><div>Zoom</div><div className="toolbar"><button onClick={()=>setCellSize(c=>Math.max(8,c-2))}>–</button><button onClick={()=>setCellSize(28)}>{Math.round((cellSize/28)*100)}%</button><button onClick={()=>setCellSize(c=>Math.min(64,c+2))}>+</button></div></div>
      <div style={{height:12}}/>
      <label className="row"><input type="checkbox" checked={showGrid} onChange={(e)=>setShowGrid(e.target.checked)}/><span>Show gridlines</span></label>
      <div style={{height:12}}/>
      <div className="toolbar"><button onClick={copyJSON}>Copy JSON</button><button onClick={downloadJSON}>Download</button><input ref={fileRef} type="file" accept="application/json" style={{display:'none'}} onChange={(e)=>{ const f=(e.target as HTMLInputElement).files?.[0]; if(f) loadFromFile(f) }}/><button onClick={()=>fileRef.current?.click()}>Load JSON</button></div>
      <p className="hint">Right-click & hold to erase • R to rotate (later) • Ctrl/Cmd+Z undo</p>
      <div style={{height:12}}/>
      <button onClick={()=>setSettingsOpen(true)} style={{ padding:'6px 10px', width:'fit-content' }}>Settings</button>
    </div></div>
    <div className="card"><h3>Slice Grid</h3><div className="content" style={{overflow:'auto'}}>
      <GridView grid={grid} cellSize={cellSize} showGrid={showGrid} tool={tool} selection={selection} onPaintAt={onPaintAt} onSelect={setSelection} getSprite={getSprite}/>
    </div></div>
    <div className="card"><h3>Inspector</h3><Inspector grid={grid} selection={selection}/></div>
    <SettingsModal open={settingsOpen} onClose={()=>setSettingsOpen(false)}/>
  </div>)
}
