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
                currentRow.push(val);
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
        return this.matrix[rowIdx][colIdx];
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
        this.matrix[rowIdx][colIdx] = cell === 0 ? 1 : 0;
    }

    updateValue(rowIdx, colIdx) {
        const currentVal = this.matrix[rowIdx][colIdx];
        const prevRow = rowIdx - 1;
        const nextRow = rowIdx + 1;
        const prevCol = colIdx - 1;
        const nextCol = colIdx + 1;

        const topNeighborVal = this.valueAt(prevRow, colIdx);
        const bottomNeighborVal = this.valueAt(nextRow, colIdx);
        const leftNeighborVal = this.valueAt(rowIdx, prevCol);
        const rightNeighborVal = this.valueAt(rowIdx, nextCol);

        const topLeftNeighborVal = this.valueAt(prevRow, prevCol);
        const topRightNeighborVal = this.valueAt(prevRow, nextCol);
        const bottomLeftNeighborVal = this.valueAt(nextRow, prevCol);
        const bottomRightNeighborVal = this.valueAt(nextRow, nextCol);

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
        const underpopulated = currentVal === 1 && neighborCount < 2;
        const staysLiving = currentVal === 1 && (neighborCount === 2 || neighborCount === 3)
        const overpopulated = currentVal === 1 && neighborCount > 3;
        const born = currentVal === 0 && neighborCount === 3;

        return !underpopulated && !overpopulated && (staysLiving || born) ? 1 : 0;
    }

    update() {
        const newVals = [];
        const newCol = new Array(this.numCols).fill(0);
        while (newVals.length < this.numRows) {
            newVals.push([...newCol]);
        }
        for (let rowIdx = 0; rowIdx < this.numRows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.numCols; colIdx++) {
                newVals[rowIdx][colIdx] = this.updateValue(rowIdx, colIdx);
            }
        }
        this.matrix = newVals;
    }
}