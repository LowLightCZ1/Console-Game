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

const Player = new Image();
Player.src = '../asstets/items/training-figure/Training-figure.png';

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


function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    // Nastavuje reálný počet pixelů pro kreslení
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Přepočet buněk
    window.cellW = canvas.width / 10;
    window.cellH = canvas.height / 5;
    
    ctx.imageSmoothingEnabled = false; // Pro ostrý pixelart
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

// 1. GENEROVÁNÍ GRIDU A KLIKÁNÍ
for(let y=0; y < 5; y++){
    for(let x=0; x < 10; x++){
        const cell = document.createElement("div");
        cell.className = "grid-cell";

        cell.style.gridColumn = `${x + 1} / ${x + 2}`;
        cell.style.gridRow = `${y + 1} / ${y + 2}`;
        
        cell.onclick = () => {
            test_figure.gridX = x; 
            test_figure.gridY = y;
            // Přepočítáme cíl podle aktuální velikosti okna
            test_figure.targetX = x * window.cellW;
            test_figure.targetY = y * window.cellH;
            test_figure.action = 1; // Spustí pohyb v update()
        };
        gameField.appendChild(cell);
    }
}

function update() {
    // Pokud postava stojí (action 0), animaci a pohyb neřešíme
    if (test_figure.action === 0) return;

    const dx = test_figure.targetX - test_figure.pixelX;
    const dy = test_figure.targetY - test_figure.pixelY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > test_figure.speed) {
        test_figure.pixelX += (dx / distance) * test_figure.speed;
        test_figure.pixelY += (dy / distance) * test_figure.speed;

        // Animace chůze (přičítá se jen když action = 1)
        frameCount++;
        if (frameCount % 10 === 0) {
            test_figure.frame = (test_figure.frame + 1) % 4;
        }
    } else {
        // Cíl dosažen
        test_figure.pixelX = test_figure.targetX;
        test_figure.pixelY = test_figure.targetY;
        test_figure.action = 0; // Přepne zpět na "stání" (default)
        test_figure.frame = 0;  // Reset na první snímek stání
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        Player,
        test_figure.frame * spriteW, 
        0,
        spriteW, spriteH,
        test_figure.pixelX, test_figure.pixelY,
        window.cellW, window.cellH
    );
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

Player.onload = () => {
    console.log("Obrázek načten.");
    gameLoop();
};

Player.onerror = () => {
    console.error("Nepodařilo se načíst obrázek na cestě:", Player.src);
};

