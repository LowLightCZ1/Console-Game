const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameField = document.getElementById("gameField");

const cellW = 192;
const cellH = 240;
const spriteW = 92;
const spriteH = 120;
const scale = 2;

canvas.width = 10 * cellW;
canvas.height = 5 * cellH;
ctx.imageSmoothingEnabled = false; // Disable image smoothing for pixelart

const spriteSheet = new Image();
spriteSheet.src = '../asstets/items/training-figure/Training-figure.png'; 

const test_figure = {
    gridX: 0,
    gridY: 0,
    pixelX: 0,
    pixelY: 0,
    targetX: 0,
    targetY: 0,
    frame: 0
};

for(let y=0; y < 5; y++){
    for(let x=0; x < 10; x++){
        
    }
}