import { jsx as _jsx } from "react/jsx-runtime";
import { Registry } from '@/core/registry';
export default function Palette({ active, setActive, setToolPaint }) { const items = Registry.listPalette(); return _jsx("div", { className: "palette", "aria-label": "Block palette", children: items.map(b => (_jsx("button", { className: active === b.id ? 'active' : '', onClick: () => { setActive(b.id); setToolPaint(); }, title: b.id, "aria-label": `Select ${b.id}`, children: b.palette?.icon?.src && (_jsx("img", { className: "sprite", src: b.palette.icon.src, alt: b.id })) }, b.id))) }); }
