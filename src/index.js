import "./index.css";
import { LifeApp } from "./lifeApp";

const APP_CONTAINER_ID = "game";
const APP_RESOLUTION_MAX = 100;

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

    playBtn.addEventListener("click", () => {
        errContainer.classList.add("hide");
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

    resetBtn.addEventListener("click", () => {
        pauseBtn.click();
        reset();
    });

    clearBtn.addEventListener("click", () => {
        pauseBtn.click();
        life.clear();
        life.updateView();
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

        const asJSON = JSON.stringify(life.getGameState());
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
                life.setGameState(fromJSON);
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
        pauseBtn.click();
        ulInput.click();
        disableSaveDialog();
    });

    reset();
    life.start();
}

window.addEventListener("load", main);
