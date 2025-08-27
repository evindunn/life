import "./index.css";

import Two from "two.js";
import {LifeModel} from "./lifeModel";
import {LifeController} from "./lifeController";

export default class Life {
    constructor(parentID, resolution) {
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

        const cellSize = Math.min(two.width, two.height) / resolution;
        const numRows = Math.round(two.height / cellSize);
        const numCols = Math.round(two.width / cellSize);

        const gameModelRow = new Array(numCols).fill(0);
        const gameModelMatrix = [];
        while (gameModelMatrix.length < numRows) {
            gameModelMatrix.push(gameModelRow);
        }

        const gameModel = new LifeModel(gameModelMatrix);
        this.gameController = new LifeController(two, gameModel, cellSize);
    }

    get generation() {
        return this.gameController.generation;
    }

    getGameState() {
        return this.gameController.model.matrix
    }

    setGameState(gameState) {
        this.gameController.model.matrix = gameState;
    }

    start() {
        this.gameController.start();
    }

    stop() {
        this.gameController.stop();
    }

    updateView() {
        this.gameController.updateView();
    }

    addUpdateListener(func) {
        this.gameController.addUpdateListener(func);
    }

    removeUpdateListener(func) {
        this.gameController.removeUpdateListener(func);
    }
}

const life = new Life("game", 100);

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

function reset() {
    const gameState = life.getGameState();
    for (let rowIdx = 0; rowIdx < gameState.length; rowIdx++) {
        const row = gameState[rowIdx];
        for (let colIdx = 0; colIdx < row.length; colIdx++) {
            row[colIdx] = Math.round(Math.random() * 100) % 10 === 0 ? 1 : 0;
        }
        console.debug(row);
        gameState[rowIdx] = row;
    }
    life.setGameState(gameState);
    life.updateView();
}

playBtn.addEventListener("click", () => {
    life.start();
    playBtn.disabled = true;
    pauseBtn.disabled = false;
});

pauseBtn.addEventListener("click", () => {
    life.stop();
    playBtn.disabled = false;
    pauseBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    pauseBtn.click();
    reset();
});

reset();
life.start();
