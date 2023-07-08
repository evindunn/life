import {LifeCell} from "./cell";

export class LifeModel {
    constructor(cellMatrix) {
        this.matrix = [];
        this.numRows = cellMatrix.length;
        this.numCols = cellMatrix[0].length;
        for (let rowIdx = 0; rowIdx < this.numRows; rowIdx++) {
            const inputRow = cellMatrix[rowIdx];
            const currentRow = [];
            for (let colIdx = 0; colIdx < this.numCols; colIdx++) {
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
        if (rowIdx >= this.numRows) {
            return 0;
        }
        if (colIdx >= this.numCols) {
            return 0;
        }
        return this.matrix[rowIdx][colIdx].value;
    }

    toggleAt(rowIdx, colIdx) {
        if (rowIdx < 0 || colIdx < 0) {
            return;
        }
        if (rowIdx >= this.numRows) {
            return;
        }
        if (colIdx >= this.numCols) {
            return;
        }
        const cell = this.matrix[rowIdx][colIdx];
        cell.value = cell.value === 0 ? 1 : 0;
    }

    update() {
        for (let rowIdx = 0; rowIdx < this.numRows; rowIdx++) {
            const currentRow = this.matrix[rowIdx];
            for (let colIdx = 0; colIdx < this.numCols; colIdx++) {
                const currentCell = currentRow[colIdx];
                currentCell.updateAlive(this);
            }
        }
    }
}