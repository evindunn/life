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
            // type: Two.Types.webgl,
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

    clear() {
        this.gameController.clear();
    }
}

const life = new Life("game", 100);

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const loadBtn = document.getElementById("load");
const dlLink = document.getElementById("download-link");
const ulInput = document.getElementById("upload-input");
const ulErr = document.getElementById("upload-error");

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
    ulErr.classList.add("d-none");
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
    ulErr.classList.add("d-none");
    pauseBtn.click();
    reset();
});

clearBtn.addEventListener("click", () => {
    ulErr.classList.add("d-none");
    pauseBtn.click();
    life.clear();
    life.updateView();
});

saveBtn.addEventListener("click", () => {
    pauseBtn.click();
    const asJSON = JSON.stringify(life.getGameState());
    dlLink.href = URL.createObjectURL(new Blob([asJSON], { type: "application/json" }));
    dlLink.click();
    dlLink.href = '#';
});

ulInput.addEventListener("change", (e) => {
    ulErr.classList.add("d-none");
    const file = e.target.files[0] || null;
    if (file === null) {
        console.warn("no file selected");
        return;
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("loadend", (e) => {
        try {
            const fromJSON = JSON.parse(e.target.result.toString());
            life.setGameState(fromJSON);
            life.updateView();
        } catch (e) {
            const err = `Invalid file: ${e.toString()}`;
            ulErr.innerText = err;
            ulErr.classList.remove("d-none");
            console.error(err);
        }
        ulInput.value = "";
    }, { once: true });
    fileReader.readAsText(file);
});

loadBtn.addEventListener("click", () => {
    pauseBtn.click();
    ulInput.click();
});

window.addEventListener("load", () => {
    reset();
    life.start();
});
