import {LifeCell} from "./cell";

export class LifeModel {
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

    toggleAt(rowIdx, colIdx) {
        if (rowIdx < 0 || colIdx < 0) {
            return;
        }
        if (rowIdx >= this.matrix.length) {
            return;
        }
        const row = this.matrix[rowIdx];
        if (colIdx >= row.length) {
            return;
        }
        const cell = this.matrix[rowIdx][colIdx];
        cell.value = cell.value === 0 ? 1 : 0;
    }

    update() {
        for (let rowIdx = 0; rowIdx < this.matrix.length; rowIdx++) {
            const currentRow = this.matrix[rowIdx];
            for (let colIdx = 0; colIdx < currentRow.length; colIdx++) {
                const currentCell = currentRow[colIdx];
                currentCell.updateAlive(this);
            }
        }
    }
}