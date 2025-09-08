import "./index.css";
import { LifeApp } from "./lifeApp";
import GOSPER_GLIDER_GUN from './public/gosper-glider-gun.json';
import PULSAR from './public/pulsar.json';

const APP_CONTAINER_ID = "game";
const APP_RESOLUTION_MAX = 100;
const APP_COOL_PRESETS = {
    'Gosper Glider Gun': GOSPER_GLIDER_GUN,
    'Pulsar': PULSAR,
};

function main() {
    const life = new LifeApp(APP_CONTAINER_ID, APP_RESOLUTION_MAX);

    const playBtn = document.getElementById("play");
    const pauseBtn = document.getElementById("pause");
    const resetBtn = document.getElementById("reset");
    const clearBtn = document.getElementById("clear");
    const saveBtn = document.getElementById("save");
    const loadBtn = document.getElementById("load");
    const saveFileContainer = document.getElementById("save-file-container");
    const saveFileInput = document.getElementById("save-file-name");
    const saveFileBtn = document.getElementById("save-file");
    const dlLink = document.getElementById("download-link");
    const ulInput = document.getElementById("upload-input");
    const errContainer = document.getElementById("error");
    const coolPresets = document.getElementById("cool-presets");

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

    function disableSaveDialog() {
        saveFileInput.value = "";
        saveFileContainer.classList.add("d-none");
        saveBtn.disabled = false;
        errContainer.classList.add("hide");
    }

    function loadGameState(numRows, numCols, gameStateJson) {
        const gameState = new Array(numRows);
        const gameCol = new Array(numCols).fill(0);
        for (let i = 0; i < numRows; i++) {
            gameState[i] = [...gameCol];
        }

        let xOffset = 0;
        let yOffset = 0;
        if (gameStateJson.bounds.xMin < 0) {
            xOffset = gameStateJson.bounds.xMin;
        }
        if (gameStateJson.bounds.xMax > numCols) {
            xOffset = -gameStateJson.bounds.xMax;
        }
        if (gameStateJson.bounds.yMin < 0) {
            yOffset = gameStateJson.bounds.yMin;
        }
        if (gameStateJson.bounds.yMax > numRows) {
            yOffset = -gameStateJson.bounds.yMax;
        }

        for (let [colIdx, rowIdx] of gameStateJson.points) {
            colIdx += xOffset;
            rowIdx += yOffset;
            gameState[rowIdx][colIdx] = 1;
        }

        return gameState;
    }

    const coolPresetKeys = Object.keys(APP_COOL_PRESETS).sort();
    for (const k of coolPresetKeys) {
        const opt = document.createElement("option");
        opt.value = APP_COOL_PRESETS[k];
        opt.innerText = k;
        coolPresets.appendChild(opt);
    }

    playBtn.addEventListener("click", () => {
        errContainer.classList.add("hide");
        coolPresets.value = '';
        life.start();
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        disableSaveDialog();
    });

    pauseBtn.addEventListener("click", () => {
        life.stop();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    });

    clearBtn.addEventListener("click", () => {
        pauseBtn.click();
        disableSaveDialog();
        coolPresets.value = '';
        life.clear();
        life.updateView();
    });

    coolPresets.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.value === '') {
            return;
        }
        fetch(e.target.value).then(res => res.json()).catch((err) => {
            console.log(err)
        }).then((data) => {
            pauseBtn.click();
            clearBtn.click();
            const newGameState = loadGameState(
                life.numRows,
                life.numCols,
                data,
            );
            life.setGameState(newGameState);
            life.updateView();
        });
    });

    resetBtn.addEventListener("click", () => {
        pauseBtn.click();
        coolPresets.value = '';
        reset();
    });

    saveBtn.addEventListener("click", () => {
        pauseBtn.click();
        saveBtn.disabled = true;
        saveFileContainer.classList.remove("d-none");
    });

    saveFileBtn.addEventListener("click", () => {
        const fileName = saveFileInput.value

        if (fileName.length === 0 || !fileName.endsWith(".json")) {
            errContainer.innerText = "Invalid file name, use a .json file";
            errContainer.classList.remove("hide");
            return;
        }

        const savePoints = [];
        let xMin = life.numCols + 1;
        let xMax = 0;
        let yMin = life.numRows + 1;
        let yMax = 0;
        for (let rowIdx = 0; rowIdx < life.numRows; rowIdx++) {
            for (let colIdx = 0; colIdx < life.numCols; colIdx++) {
                if (life.gameController.model.valueAt(rowIdx, colIdx) === 1) {
                    savePoints.push([colIdx, rowIdx]);
                    if (colIdx < xMin) {
                        xMin = colIdx;
                    }
                    if (colIdx > xMax) {
                        xMax = colIdx;
                    }
                    if (rowIdx < yMin) {
                        yMin = rowIdx;
                    }
                    if (rowIdx > yMax) {
                        yMax = rowIdx;
                    }
                }
            }
        }

        const asJSON = JSON.stringify({
            bounds: { xMin, xMax, yMin, yMax },
            points: savePoints,
        });
        dlLink.href = URL.createObjectURL(new Blob([asJSON], { type: "application/json" }));
        dlLink.download = fileName;
        dlLink.click();
        dlLink.href = '#';
        disableSaveDialog();
    });

    ulInput.addEventListener("change", (e) => {
        errContainer.classList.add("hide");
        const file = e.target.files[0] || null;
        if (file === null) {
            console.warn("no file selected");
            return;
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", (e) => {
            try {
                const fromJSON = JSON.parse(e.target.result.toString());

                life.clear();
                const newGameState = loadGameState(
                    life.numRows,
                    life.numCols,
                    fromJSON,
                );
                life.setGameState(newGameState);
                life.updateView();

            } catch (e) {
                const err = `Invalid file: ${e.toString()}`;
                errContainer.innerText = err;
                errContainer.classList.remove("hide");
                console.error(err);
            }
            ulInput.value = "";
        }, { once: true });
        fileReader.readAsText(file);
    });

    loadBtn.addEventListener("click", () => {
        coolPresets.value = '';
        pauseBtn.click();
        ulInput.click();
        disableSaveDialog();
    });

    reset();
    life.start();
}

window.addEventListener("load", main);
