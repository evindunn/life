export class LifeCell {
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