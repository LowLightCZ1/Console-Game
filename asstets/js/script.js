const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameField = document.getElementById("gameField");

if (!localStorage.getItem("playerClass")) {
  console.warn("No class selected. Type 'class ?' in the console.");
}

console.log(localStorage);

let cellW = 192;
let cellH = 120;
let spriteW = 32; 
let spriteH = 32;

let playerH = 32;
let playerW = 32;


canvas.width = 10 * cellW;
canvas.height = 5 * cellH;
ctx.imageSmoothingEnabled = false;

const classMap = {
    "Warrior": "../asstets/items/classes/Warrior.png",
    "Mage": "../asstets/items/classes/Mage.png",
    "Thief": ""
};

const savedClass = localStorage.getItem("playerClass") || "Warrior";
let playerSprite = new Image();
playerSprite.src = classMap[savedClass] || classMap["Warrior"];


function resizeCanvas() {
    const rect = gameField.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // canvas.width = rect.width * dpr;
    // canvas.height = rect.height * dpr;
    canvas.width = rect.width;
    canvas.height = rect.height;

    //ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale all drawing by dpr

    window.cellW = canvas.width / 10;
    window.cellH = canvas.height / 5;

    playerH = window.cellH;
    playerW = window.cellW;


    ctx.imageSmoothingEnabled = false;
}

console.log(window.innerHeight)

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

const figure = {
    pixelX: 1 * window.cellW,
    pixelY: 1 * window.cellH,
    targetX: 1 * window.cellW,
    targetY: 1 * window.cellH,
    gridX: 2,
    gridY: 2,
    frame: 0,
    action: 0,
    speed: 5
};

let frameCount = 0;

console.log(figure.pixelX, figure.pixelY);


// ------------------------------------- //
fetch("../asstets/json/background.json")
.then(res => {
    if(!res.ok) throw new Error(`Soubor "${"../asstets/json/background.json"}"(HTTP ${res.status})`)
    return res.json();
})
.then(data => {
    buildGrid(data);
});

function buildGrid(data)
{
    const imageMap = {};
    data.forEach(({filename, row, col}) => {
        imageMap[`${row}-${col}`] = filename
    });

    for(let row = 1; row <= 5; row++){
        for(let col = 1; col <= 10; col++){
            const cell = document.createElement("div");
            const key = `${row}-${col}`;
            const filename = imageMap[key];

            if(filename){
                cell.className = "grid-cell";
                const img = document.createElement("img");
                img.className = "bgr-img";
                img.src = "../asstets/items/background/" + filename;
                img.alt = filename;
                img.loading = "lazy";
                img.imageSmoothingEnabled = false;
                cell.appendChild(img);
                const num = document.createElement("p");
                num.className = "field-num";
                num.textContent = key;
                cell.appendChild(num);

            }
            else{
                cell.className = "empty cell";
            }
                
            if(filename === "Game-Field.png"){
                cell.className = "game-cell";

            }
            


            cell.style.gridRow = row;
            cell.style.gridColumn = col;
            gameField.appendChild(cell);
        }
    }

}
// -------------------------------------- //

function update() {
    // Pokud postava stojí (action 0), animaci a pohyb neřešíme
    //if (figure.action === 0) return;

    const dx = figure.targetX - figure.pixelX;
    const dy = figure.targetY - figure.pixelY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > figure.speed) {
        figure.pixelX += (dx / distance) * figure.speed;
        figure.pixelY += (dy / distance) * figure.speed;

        // Animace chůze (přičítá se jen když action = 1)
        frameCount++;
        if (frameCount % 10 === 0) {
            figure.frame = (figure.frame + 1) % 4;
        }
    } else {
        // Cíl dosažen
        figure.pixelX = figure.targetX;
        figure.pixelY = figure.targetY;
        figure.action = 0; // Přepne zpět na "stání" (default)
        figure.frame = 0;  // Reset na první snímek stání
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillStyle = "red";
    //ctx.fillRect(figure.pixelX, figure.pixelY, playerW, playerH);

    const drawW = window.cellW * 1; // or whatever looks good
    const drawH = window.cellH * 1;

    // Tweak these offset values until it looks right

    ctx.drawImage(
        playerSprite,
        figure.frame * spriteW, 0, spriteW, spriteH,
        figure.pixelX,
        figure.pixelY,
        drawW, drawH
    );
}


window.gameAPI = {
    moveCharacter(col, row){
        const maxCol = 10, maxRow = 5;
        if(col < 1 || col > maxCol || row < 1 || row > maxRow){
            return { ok: false, msg: `Out of bounds. Grid is ${maxCol}×${maxRow}.` };
        }
        figure.gridX   = col;
        figure.gridY   = row;
        figure.targetX = (col - 1) * window.cellW;
        figure.targetY = (row - 1) * window.cellH;
        figure.action  = 1;
        return { ok: true };
    },

    setClass(className) {
        const src = classMap[className];
        if (!src) {
            console.error("No sprite mapped for class:", className);
            return;
        }
        const newImg = new Image();
        newImg.onload = () => { playerSprite = newImg; };
        newImg.onerror = () => console.error("Failed to load sprite:", src);
        newImg.src = src;
    }

}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

playerSprite.onload = () => {
    console.log("Obrázek načten.");
    gameLoop();
};

playerSprite.onerror = () => {
    console.error("Nepodařilo se načíst obrázek na cestě:", Player.src);
};

console.log("Class:", localStorage.getItem("playerClass"));
console.log("Sprite src:", playerSprite.src);

// document.addEventListener("DOMContentLoaded", function () {
//     const name = localStorage.getItem("nameValue");
//     console.log("Player:", name); // use your name however you need

//     // Fullscreen the page as soon as any click happens
//     document.addEventListener("click", function enterFS() {
//         document.documentElement.requestFullscreen().catch(err => {
//             console.warn("Fullscreen failed:", err);
//         });
//         document.removeEventListener("click", enterFS); // only trigger once
//     }, { once: true });
// });