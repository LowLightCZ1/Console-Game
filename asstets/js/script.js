const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameField = document.getElementById("gameField");

const cellW = 192;
const cellH = 240;
const spriteW = 32; 
const spriteH = 32;

canvas.width = 10 * cellW;
canvas.height = 5 * cellH;
ctx.imageSmoothingEnabled = false;

const spriteSheet = new Image();

const test_figure = {
    pixelX: 0,
    pixelY: 0,
    targetX: 0,
    targetY: 0,
    frame: 0,
    action: 0,
    speed: 5
};

let frameCount = 0;

// 1. GENEROVÁNÍ GRIDU A KLIKÁNÍ
for(let y=0; y < 5; y++){
    for(let x=0; x < 10; x++){
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        // Přidání event listeneru pro pohyb
        cell.onclick = () => {
            test_figure.targetX = x * cellW;
            test_figure.targetY = y * cellH;
            test_figure.action = 1; // Přepnutí na animaci pohybu
            console.log(`Cíl nastaven na: ${x}, ${y}`);
        };
        gameField.appendChild(cell);
    }
}

function update() {
    // Pohyb postavy k cíli
    if (Math.abs(test_figure.pixelX - test_figure.targetX) > 5) {
        test_figure.pixelX += (test_figure.targetX > test_figure.pixelX) ? test_figure.speed : -test_figure.speed;
    }
    if (Math.abs(test_figure.pixelY - test_figure.targetY) > 5) {
        test_figure.pixelY += (test_figure.targetY > test_figure.pixelY) ? test_figure.speed : -test_figure.speed;
    }

    // Zastavení animace v cíli
    if (Math.abs(test_figure.pixelX - test_figure.targetX) <= 5 && Math.abs(test_figure.pixelY - test_figure.targetY) <= 5) {
        test_figure.action = 0;
    }

    frameCount++;
    if (frameCount % 10 === 0) {
        test_figure.frame = (test_figure.frame + 1) % 4;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // TEST: Pokud uvidíš červený čtverec, canvas funguje a chyba je v obrázku
    ctx.fillStyle = "red";
    ctx.fillRect(test_figure.pixelX, test_figure.pixelY, 50, 50);

    ctx.drawImage(
        spriteSheet,
        test_figure.frame * spriteW,
        test_figure.action * spriteH,
        spriteW, spriteH,
        test_figure.pixelX, test_figure.pixelY,
        cellW, cellH
    );
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

spriteSheet.onload = () => {
    console.log("Obrázek načten.");
    gameLoop();
};

spriteSheet.onerror = () => {
    console.error("Nepodařilo se načíst obrázek na cestě:", spriteSheet.src);
};

// Cesta musí přesně odpovídat tvé struktuře (všimni si "asstets")
spriteSheet.src = '../asstets/items/training-figure/Training-figure.png';