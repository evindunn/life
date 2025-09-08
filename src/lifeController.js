import Two from "two.js";

const GRID_COLOR = '#888888';
const APP_STACK_LENGTH = 25;

export class LifeController {
    constructor(two, model, cellSize) {
        this.two = two;
        this.model = model;
        this.cellSize = cellSize;
        this.stack = [];

        this.cells = new Two.Group();
        this.cells.corner();
        for (let rowIdx = 0; rowIdx < this.model.matrix.length; rowIdx++) {
            const currentRow = this.model.matrix[rowIdx];
            const rowGroup = new Two.Group();
            rowGroup.corner();
            for (let colIdx = 0; colIdx < currentRow.length; colIdx++) {
                const currentCellVal = this.model.valueAt(rowIdx, colIdx);
                const cell = this.makeCell(rowIdx, colIdx);
                cell.fill = currentCellVal === 1 ? 'white' : null;
                rowGroup.add(cell);
            }
            this.cells.add(rowGroup);
        }
        this.two.add(this.cells);

        this.grid = this.two.makeGroup();
        this.grid.corner();

        for (let x = 0; x < this.two.width; x += this.cellSize) {
            const line = new Two.Line(x, 0, x, this.two.height);
            line.stroke = GRID_COLOR;
            line.linewidth = 1;
            this.grid.add(line);
        }
        for (let y = 0; y < this.two.height; y+= this.cellSize) {
            const line = new Two.Line(0, y, this.two.width, y);
            line.stroke = GRID_COLOR;
            line.linewidth = 1;
            this.grid.add(line);
        }

        this.two.add(this.grid);
        this._render();

        this.gameLoop = null;
        this.mouseIsDown = false;
        this.clickedSpot = [0, 0];

        const dragMouseListener = this.onDragMouse.bind(this);
        this.two.renderer.domElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clickedSpot = [e.offsetX, e.offsetY];
            if (!this.mouseIsDown) {
                this.two.renderer.domElement.addEventListener('mousemove', dragMouseListener);
                this.mouseIsDown = true;
            }
        });
        this.two.renderer.domElement.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.offsetX === this.clickedSpot[0] && e.offsetY === this.clickedSpot[1]) {
                this.onCanvasClicked(e);
            }
            if (this.mouseIsDown) {
                this.two.renderer.domElement.removeEventListener('mousemove', dragMouseListener);
                this.mouseIsDown = false;
            }
        });
    }

    get isRunning() {
        return this.gameLoop !== null;
    }

    _render() {
        requestAnimationFrame(() => this.two.update());
    }

    _stackPush(rowIdx, colIdx, value) {
        this.stack.push([rowIdx, colIdx, value]);
        if (this.stack.length > APP_STACK_LENGTH) {
            const startIdx = this.stack.length - APP_STACK_LENGTH;
            this.stack = this.stack.slice(startIdx);
        }
    }

    undo() {
        console.debug(this.stack);
        if (this.stack.length > 0) {
            const val = this.stack.pop();
            this.model.matrix[val[0]][val[1]] = val[2] === 1 ? 0 : 1;
        }
        console.debug(this.stack);
        this.updateView();
    }

    makeCell(row, col) {
        const realSize = this.cellSize - 1;
        const cell = new Two.Rectangle(
            col * this.cellSize + 0.5,
            row * this.cellSize + 0.5,
            realSize,
            realSize,
        );
        const originCoords = -realSize / 2;
        cell.origin = new Two.Vector(originCoords, originCoords);
        cell.linewidth = 0;
        return cell;
    }

    onCanvasClicked(e) {
        if (!this.isRunning) {
            const row = Math.floor(e.offsetY / this.cellSize);
            const col = Math.floor(e.offsetX / this.cellSize);
            this.onCellClicked(row, col);
        }
    }

    onCellClicked(rowIdx, colIdx) {
        this.model.toggleAt(rowIdx, colIdx);
        this._stackPush(rowIdx, colIdx, this.model.valueAt(rowIdx, colIdx));
        this.updateView();
    }

    onDragMouse(e) {
        if (!this.isRunning) {
            const row = Math.floor(e.offsetY / this.cellSize);
            const col = Math.floor(e.offsetX / this.cellSize);
            console.debug(`[${row}, ${col}]`);
            this.model.matrix[row][col] = 1;
            this._stackPush(row, col, 1);
            this.updateView();
        }
    }

    updateView() {
        for (let rowIdx = 0; rowIdx < this.cells.children.length; rowIdx++) {
            const rowGroup = this.cells.children[rowIdx];
            for (let colIdx = 0; colIdx < rowGroup.children.length; colIdx++) {
                const currentCellVal = this.model.valueAt(rowIdx, colIdx);
                const cell = rowGroup.children[colIdx];
                cell.fill = currentCellVal === 1 ? 'white' : null;
            }
        }
        this._render();
    }

    start() {
        if (!this.isRunning) {
            this.two.remove(this.grid);
            this.gameLoop = setInterval(() => {
                this.model.update();
                this.updateView();
            }, 75);
        }
    }

    stop() {
        if (this.isRunning) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            this.two.add(this.grid);
            this._render();
        }
    }

    get generation() {
        return this.model.generation;
    }

    addUpdateListener(func) {
        this.model.addUpdateListener(func);
    }

    removeUpdateListener(func) {
        this.model.removeUpdateListener(func);
    }

    clear() {
        this.stack = [];
        for (let rowIdx = 0; rowIdx < this.model.numRows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.numCols; colIdx++) {
                this.model.matrix[rowIdx][colIdx] = 0;
            }
        }
    }
}