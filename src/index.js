import Two from "two.js";
import {LifeModel} from "./lifeModel";
import {LifeController} from "./lifeController";

export default class Life {
    constructor(parentID) {
        const parentElem = document.getElementById(parentID);
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

        const gameModel = new LifeModel(gameModelMatrix);
        this.gameController = new LifeController(two, gameModel, cellSize);
    }

    isRunning() {
        return this.gameController.isRunning;
    }

    start() {
        this.gameController.start();
    }

    stop() {
        this.gameController.stop();
    }
}