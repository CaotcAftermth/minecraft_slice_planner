export const keyOf = (x, y) => `${x},${y}`;
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export function makeEmptyGrid(w = 30, h = 20) { const cells = {}; for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
        const id = keyOf(x, y);
        cells[id] = { id, x, y, block: null, rot: 0, meta: {} };
    }
} return { w, h, cells }; }
