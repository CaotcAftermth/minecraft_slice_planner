import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import DomGrid from '@/render/adapters/domgrid';
import { keyOf } from '@/core/types';
export default function GridView({ grid, cellSize, showGrid, tool, selection, onPaintAt, onSelect, getSprite }) {
    const paintingRef = useRef(false);
    const rmbHeldRef = useRef(false);
    useEffect(() => { const up = () => { paintingRef.current = false; rmbHeldRef.current = false; }; window.addEventListener('mouseup', up); return () => window.removeEventListener('mouseup', up); }, []);
    return _jsx(DomGrid, { grid: grid, cellSize: cellSize, showGrid: showGrid, onMouseDown: (e) => { const rect = e.currentTarget.getBoundingClientRect(); const rx = e.clientX - rect.left; const ry = e.clientY - rect.top; const x = Math.floor(rx / cellSize); const y = Math.floor(ry / cellSize); if (e.button === 2)
            rmbHeldRef.current = true; paintingRef.current = true; onPaintAt(x, y, e); }, onMouseMove: (e) => { if (!paintingRef.current && !rmbHeldRef.current)
            return; const rect = e.currentTarget.getBoundingClientRect(); const rx = e.clientX - rect.left; const ry = e.clientY - rect.top; const x = Math.floor(rx / cellSize); const y = Math.floor(ry / cellSize); onPaintAt(x, y, e); }, onMouseUp: () => { paintingRef.current = false; rmbHeldRef.current = false; }, renderCell: (x, y) => { const id = keyOf(x, y); const sel = tool === 'select' && selection === id; const sprite = getSprite(x, y); return (_jsx("div", { className: `cell ${sel ? 'sel' : ''}`, children: sprite && (_jsx("img", { src: sprite.src, style: { width: '100%', height: '100%', imageRendering: 'pixelated', transform: (sprite.flipX || sprite.flipY) ? `scale(${sprite.flipX ? -1 : 1}, ${sprite.flipY ? -1 : 1})` : 'none' }, draggable: false, alt: "" })) })); } });
}
