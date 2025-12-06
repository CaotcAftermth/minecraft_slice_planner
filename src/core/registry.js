class _Registry {
    map = new Map();
    register(def) { if (this.map.has(def.id))
        console.warn('[Registry] duplicate', def.id); this.map.set(def.id, def); }
    get(id) { return this.map.get(id); }
    list() { return Array.from(this.map.values()); }
    listPalette() { return this.list().filter(b => b.palette?.show); }
}
export const Registry = new _Registry();
