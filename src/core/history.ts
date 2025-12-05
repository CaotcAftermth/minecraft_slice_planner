import { useState } from 'react'
export function useHistory<T>(initial:T){ const [past,setPast]=useState<T[]>([]); const [present,setPresent]=useState<T>(initial); const [future,setFuture]=useState<T[]>([]);
  const commit=(next:T)=>{ setPast(p=>[...p,present]); setPresent(next); setFuture([]) }
  const undo=()=> setPast(p=>{ if(!p.length) return p; const prev=p[p.length-1]; setFuture(f=>[present,...f]); setPresent(prev); return p.slice(0,-1) })
  const redo=()=> setFuture(f=>{ if(!f.length) return f; const nx=f[0]; setPast(p=>[...p,present]); setPresent(nx); return f.slice(1) })
  return { state:present, commit, undo, redo }
}
