import Two from "two.js";

const GRID_COLOR = '#888888';

export class LifeController {
    constructor(two, model, cellSize) {
        this.two = two;
        this.model = model;
        this.cellSize = cellSize;

        this.cells = this.makeTwoGroup();
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
        this.two.update();

        this.gameLoop = null;
        this.two.renderer.domElement.addEventListener('click', (e) => {
            this.onCanvasClicked(e);
        });
    }

    get isRunning() {
        return this.gameLoop !== null;
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
        cell.fill = 'white';
        cell.linewidth = 0;

        return cell;
    }

    makeTwoGroup() {
        const newCells = [];
        for (let rowIdx = 0; rowIdx < this.model.matrix.length; rowIdx++) {
            const currentRow = this.model.matrix[rowIdx];
            for (let colIdx = 0; colIdx < currentRow.length; colIdx++) {
                const currentCellVal = this.model.valueAt(rowIdx, colIdx);
                if (currentCellVal === 1) {
                    const newCell = this.makeCell(rowIdx, colIdx);
                    newCells.push(newCell);
                }
            }
        }
        const group = new Two.Group();
        group.corner();
        group.add(...newCells);
        return group;
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
        this.updateView();
    }

    updateView() {
        this.two.remove(this.cells);
        this.cells = this.makeTwoGroup();
        this.two.add(this.cells);
        this.two.update();
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
            this.two.update();
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
}