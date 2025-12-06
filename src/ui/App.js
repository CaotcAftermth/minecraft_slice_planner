import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { makeEmptyGrid, keyOf } from '@/core/types';
import { useHistory } from '@/core/history';
import { Registry } from '@/core/registry';
import '@/blocks';
import Palette from '@/ui/Palette';
import GridView from '@/ui/GridView';
import Inspector from '@/ui/Inspector';
import SettingsModal from '@/ui/SettingsModal';
export default function App() {
    const { state: grid, commit, undo, redo } = useHistory(makeEmptyGrid(30, 20));
    const [tool, setTool] = useState('paint');
    const [active, setActive] = useState('block');
    const [selection, setSelection] = useState(null);
    const [cellSize, setCellSize] = useState(28);
    const [showGrid, setShowGrid] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    function applyPatches(patches) { const next = { ...grid, cells: { ...grid.cells } }; for (const p of patches) {
        next.cells[p.id] = { ...next.cells[p.id], ...p.changes };
    } commit(next); }
    function getRegion(e, x) { const rect = e.currentTarget.getBoundingClientRect(); const relX = e.clientX - rect.left; const cellW = rect.width / grid.w; const cx = relX - x * cellW; if (cx < cellW / 3)
        return 'left'; if (cx > 2 * cellW / 3)
        return 'right'; return 'center'; }
    function onPaintAt(x, y, e) { if (x < 0 || y < 0 || x >= grid.w || y >= grid.h)
        return; const id = keyOf(x, y); if (tool === 'erase' || (e && e.button === 2)) {
        applyPatches([{ id, changes: { block: null, meta: {} } }]);
        return;
    } if (tool === 'select') {
        setSelection(id);
        return;
    } const def = Registry.get(active); const region = e ? getRegion(e, x) : 'center'; const patches = def?.onPlace ? def.onPlace({ grid, x, y, region, modifiers: { shift: !!e?.shiftKey, alt: !!e?.altKey, ctrl: !!(e && (e.ctrlKey || e.metaKey)) } }) : [{ id, changes: { block: active } }]; applyPatches(patches); }
    function getSprite(x, y) { const c = grid.cells[keyOf(x, y)]; if (!c || !c.block)
        return null; const def = Registry.get(c.block); return def?.render(c, { grid }) ?? null; }
    const fileRef = useRef(null);
    function toJSON() { return { version: 1, w: grid.w, h: grid.h, cells: Object.values(grid.cells).filter(c => c.block !== null).map(({ id, x, y, block, rot, meta }) => ({ id, x, y, block, rot, meta })) }; }
    async function copyJSON() { await navigator.clipboard.writeText(JSON.stringify(toJSON(), null, 2)); }
    function downloadJSON() { const blob = new Blob([JSON.stringify(toJSON(), null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'slice.json'; a.click(); URL.revokeObjectURL(url); }
    function loadFromFile(file) { const reader = new FileReader(); reader.onload = () => { try {
        const parsed = JSON.parse(String(reader.result));
        const g = makeEmptyGrid(parsed.w ?? grid.w, parsed.h ?? grid.h);
        for (const c of parsed.cells ?? []) {
            const id = keyOf(c.x, c.y);
            g.cells[id] = { id, x: c.x, y: c.y, block: c.block, rot: c.rot ?? 0, meta: c.meta ?? {} };
        }
        commit(g);
    }
    catch {
        alert('Invalid file');
    } }; reader.readAsText(file); }
    return (_jsxs("div", { className: "app", children: [_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Palette & Controls" }), _jsxs("div", { className: "content", children: [_jsx(Palette, { active: active, setActive: setActive, setToolPaint: () => setTool('paint') }), _jsx("div", { style: { height: 12 } }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { onClick: () => setTool('paint'), className: tool === 'paint' ? 'active' : '', children: "Paint" }), _jsx("button", { onClick: () => setTool('select'), className: tool === 'select' ? 'active' : '', children: "Select" }), _jsx("button", { onClick: () => setTool('erase'), className: tool === 'erase' ? 'active' : '', children: "Erase" }), _jsx("button", { onClick: undo, children: "Undo" }), _jsx("button", { onClick: redo, children: "Redo" })] }), _jsx("div", { style: { height: 12 } }), _jsxs("div", { className: "row", style: { justifyContent: 'space-between' }, children: [_jsx("div", { children: "Zoom" }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { onClick: () => setCellSize(c => Math.max(8, c - 2)), children: "\u2013" }), _jsxs("button", { onClick: () => setCellSize(28), children: [Math.round((cellSize / 28) * 100), "%"] }), _jsx("button", { onClick: () => setCellSize(c => Math.min(64, c + 2)), children: "+" })] })] }), _jsx("div", { style: { height: 12 } }), _jsxs("label", { className: "row", children: [_jsx("input", { type: "checkbox", checked: showGrid, onChange: (e) => setShowGrid(e.target.checked) }), _jsx("span", { children: "Show gridlines" })] }), _jsx("div", { style: { height: 12 } }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { onClick: copyJSON, children: "Copy JSON" }), _jsx("button", { onClick: downloadJSON, children: "Download" }), _jsx("input", { ref: fileRef, type: "file", accept: "application/json", style: { display: 'none' }, onChange: (e) => { const f = e.target.files?.[0]; if (f)
                                            loadFromFile(f); } }), _jsx("button", { onClick: () => fileRef.current?.click(), children: "Load JSON" })] }), _jsx("p", { className: "hint", children: "Right-click & hold to erase \u2022 R to rotate (later) \u2022 Ctrl/Cmd+Z undo" }), _jsx("div", { style: { height: 12 } }), _jsx("button", { onClick: () => setSettingsOpen(true), style: { padding: '6px 10px', width: 'fit-content' }, children: "Settings" })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Slice Grid" }), _jsx("div", { className: "content", style: { overflow: 'auto' }, children: _jsx(GridView, { grid: grid, cellSize: cellSize, showGrid: showGrid, tool: tool, selection: selection, onPaintAt: onPaintAt, onSelect: setSelection, getSprite: getSprite }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Inspector" }), _jsx(Inspector, { grid: grid, selection: selection })] }), _jsx(SettingsModal, { open: settingsOpen, onClose: () => setSettingsOpen(false) })] }));
}
