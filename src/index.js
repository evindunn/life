import Two from "two.js";

const modelUpdateEvent = new Event('lifeModelUpdate');

class LifeCell {
    constructor(row, column, value) {
        this.row = row;
        this.col = column;
        this.value = value;
    }

    updateAlive(matrix) {
        const prevRow = this.row - 1;
        const prevCol = this.col - 1;
        const nextRow = this.row + 1;
        const nextCol = this.col + 1;

        const topNeighborVal = matrix.valueAt(prevRow, this.col);
        const bottomNeighborVal = matrix.valueAt(nextRow, this.col);
        const leftNeighborVal = matrix.valueAt(this.row, prevCol);
        const rightNeighborVal = matrix.valueAt(this.row, nextCol);

        const topLeftNeighborVal = matrix.valueAt(prevRow, prevCol);
        const topRightNeighborVal = matrix.valueAt(prevRow, nextCol);
        const bottomLeftNeighborVal = matrix.valueAt(nextRow, prevCol);
        const bottomRightNeighborVal = matrix.valueAt(nextRow, nextCol);

        const neighborCount = (
            topNeighborVal +
            bottomNeighborVal +
            leftNeighborVal +
            rightNeighborVal +
            topLeftNeighborVal +
            topRightNeighborVal +
            bottomLeftNeighborVal +
            bottomRightNeighborVal
        );
        const underpopulated = this.value === 1 && neighborCount < 2;
        const staysLiving = this.value === 1 && (neighborCount === 2 || neighborCount === 3)
        const overpopulated = this.value === 1 && neighborCount > 3;
        const born = this.value === 0 && neighborCount === 3;

        this.value = !underpopulated && !overpopulated && (staysLiving || born) ? 1 : 0;
    }
}

function updateView(gameModel, cellSize) {
    const newCells = [];
    for (let rowIdx = 0; rowIdx < gameModel.matrix.length; rowIdx++) {
        const currentRow = gameModel.matrix[rowIdx];
        for (let colIdx = 0; colIdx < currentRow.length; colIdx++) {
            const currentCellVal = gameModel.valueAt(rowIdx, colIdx);
            if (currentCellVal === 1) {
                const newCell = createCell(cellSize, rowIdx, colIdx);
                newCells.push(newCell);
            }
        }
    }
    const group = new Two.Group();
    group.corner();
    group.add(...newCells);
    return group;
}

class LifeModel {
    constructor(cellMatrix) {
        this.matrix = [];
        for (let rowIdx = 0; rowIdx < cellMatrix.length; rowIdx++) {
            const inputRow = cellMatrix[rowIdx];
            const currentRow = [];
            for (let colIdx = 0; colIdx < inputRow.length; colIdx++) {
                const val = inputRow[colIdx];
                currentRow.push(new LifeCell(rowIdx, colIdx, val));
            }
            this.matrix.push(currentRow);
        }
    }

    valueAt(rowIdx, colIdx) {
        if (rowIdx < 0 || colIdx < 0) {
            return 0;
        }
        if (rowIdx >= this.matrix.length) {
            return 0;
        }
        const row = this.matrix[rowIdx];
        if (colIdx >= row.length) {
            return 0;
        }
        return this.matrix[rowIdx][colIdx].value;
    }

    update() {
        for (let rowIdx = 0; rowIdx < this.matrix.length; rowIdx++) {
            const currentRow = this.matrix[rowIdx];
            for (let colIdx = 0; colIdx < currentRow.length; colIdx++) {
                const currentCell = currentRow[colIdx];
                currentCell.updateAlive(this);
            }
        }
        window.dispatchEvent(modelUpdateEvent);
    }
}

function createCell(cellSize, row, col) {
    const realSize = cellSize - 1;
    const cell = new Two.Rectangle(
        col * cellSize + 0.5,
        row * cellSize + 0.5,
        realSize,
        realSize,
    );
    const originCoords = -realSize / 2;
    cell.origin = new Two.Vector(originCoords, originCoords);
    cell.fill = 'white';
    cell.linewidth = 0;
    return cell;
}

export function create(parent_id) {
    const parentElem = document.getElementById(parent_id);
    const twoOpts = {
        fitted: true,
    };
    const two = new Two(twoOpts);
    two.appendTo(parentElem);

    const background = two.makeRectangle(
        two.width / 2,
        two.height / 2,
        two.width,
        two.height
    );
    background.fill = 'black';

    const cellSize = Math.min(two.width, two.height) / 36;
    const numRows = two.height / cellSize;
    const numCols = two.width / cellSize;

    const gameModelRow = new Array(numCols).fill(0);
    const gameModelMatrix = [];
    while (gameModelMatrix.length < numRows) {
        gameModelMatrix.push([...gameModelRow]);
    }

    gameModelMatrix[10][10] = 1;
    gameModelMatrix[11][10] = 1;

    gameModelMatrix[10][11] = 1;
    gameModelMatrix[11][11] = 1;

    gameModelMatrix[9][9] = 1;
    gameModelMatrix[12][12] = 1;

    gameModelMatrix[9][12] = 1;
    gameModelMatrix[12][9] = 1;

    gameModelMatrix[30][25] = 1;
    gameModelMatrix[30][26] = 1;
    gameModelMatrix[31][25] = 1;
    gameModelMatrix[31][26] = 1;

    const gameModel = new LifeModel(gameModelMatrix);

    let cells = updateView(gameModel, cellSize);
    two.add(cells);

    window.addEventListener(modelUpdateEvent.type, () => {
        cells.remove();
        cells = updateView(gameModel, cellSize);
        two.add(cells);
    });

    two.play();

    setInterval(() => {
        gameModel.update();
    }, 175);
}