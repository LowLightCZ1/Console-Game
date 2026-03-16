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
            }
            else{
                cell.className = "empty cell";
            }

            cell.onclick = () => {
                test_figure.gridX = col; 
                test_figure.gridY = row;
                // Přepočítáme cíl podle aktuální velikosti okna
                test_figure.targetX = (col - 1) * window.cellW;
                test_figure.targetY = (row - 1) * window.cellH;
                test_figure.action = 1; // Spustí pohyb v update()
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

