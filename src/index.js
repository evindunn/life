import Two from "two.js";
import {LifeModel} from "./lifeModel";
import {LifeController} from "./lifeController";

export function create(parent_id) {
    const parentElem = document.getElementById(parent_id);
    const twoOpts = {
        fitted: true,
        autostart: false,
        type: "SVGRenderer"
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
    const gameController = new LifeController(two, gameModel, cellSize);

    gameController.start();
    setTimeout(() => {
        gameController.stop();
    }, 3000);
}