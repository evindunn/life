import Two from "two.js";
import {LifeModel} from "./lifeModel";

class LifeView {
    constructor(model, cellSize) {
        this.model = model;
        this.cellSize = cellSize;
    }

    createCell(row, col) {
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

    update() {
        const newCells = [];
        for (let rowIdx = 0; rowIdx < this.model.matrix.length; rowIdx++) {
            const currentRow = this.model.matrix[rowIdx];
            for (let colIdx = 0; colIdx < currentRow.length; colIdx++) {
                const currentCellVal = this.model.valueAt(rowIdx, colIdx);
                if (currentCellVal === 1) {
                    const newCell = this.createCell(rowIdx, colIdx);
                    newCells.push(newCell);
                }
            }
        }
        const group = new Two.Group();
        group.corner();
        group.add(...newCells);
        return group;
    }

    addTo(elementSelector) {
        
    }
}

export function create(parent_id) {
    const parentElem = document.getElementById(parent_id);
    const twoOpts = {
        fitted: true,
        autostart: false,
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
    const numRows = Math.round(two.height / cellSize);
    const numCols = Math.round(two.width / cellSize);

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

    gameModelMatrix[29][24] = 1;
    gameModelMatrix[29][27] = 1;

    gameModelMatrix[30][25] = 1;
    gameModelMatrix[30][26] = 1;

    gameModelMatrix[31][25] = 1;
    gameModelMatrix[31][26] = 1;

    gameModelMatrix[32][24] = 1;
    gameModelMatrix[32][27] = 1;

    const gameModel = new LifeModel(gameModelMatrix);
    const gameView = new LifeView(gameModel, cellSize);

    let cells = gameView.update();
    two.add(cells);

    setInterval(() => {
        gameModel.update();
        cells.remove();
        cells = gameView.update();
        two.add(cells);
        two.update();
    }, 100);
}