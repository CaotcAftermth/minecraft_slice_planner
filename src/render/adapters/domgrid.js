import { jsx as _jsx } from "react/jsx-runtime";
export default function DomGrid(props) {
    const { grid, cellSize, showGrid } = props;
    const cells = [];
    for (let y = 0; y < grid.h; y++) {
        for (let x = 0; x < grid.w; x++) {
            cells.push(_jsx("div", { style: { width: cellSize, height: cellSize }, children: props.renderCell(x, y) }, `${x},${y}`));
        }
    }
    return _jsx("div", { className: `grid ${showGrid ? 'with-grid' : ''}`, onMouseUp: props.onMouseUp, onMouseLeave: props.onMouseUp, onMouseDown: props.onMouseDown, onMouseMove: props.onMouseMove, style: { display: 'grid', gridTemplateColumns: `repeat(${grid.w}, ${cellSize}px)`, gridTemplateRows: `repeat(${grid.h}, ${cellSize}px)`, width: grid.w * cellSize, height: grid.h * cellSize, gap: 0, ['--cell']: `${cellSize}px` }, children: cells });
}
