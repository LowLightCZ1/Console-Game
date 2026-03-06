fetch('../asstets/json/commands.json')
.then(res => res.json())
.then(command => {
    const consoleArea = document.getElementById("consoleArea");
    const startCd = command.find(cd => cd.cd1);

    let promt = command.find(pl => pl.player0 || "player_0: ")
    
    // Nastavíme počáteční text
    consoleArea.value = startCd ? startCd.cd1 : "start_message_error:404";

    // Dynamicky určíme délku textu, který se nesmí mazat
    let lockedLength = consoleArea.value.length;

    consoleArea.addEventListener('keydown', (e) => {
        const { selectionStart, selectionEnd } = consoleArea;

        // Zabránit mazání (Backspace) v zamčené oblasti
        if (e.key === 'Backspace' && selectionStart <= lockedLength) {
            e.preventDefault();
        }

        // Zabránit mazání (Delete) v zamčené oblasti
        if (e.key === 'Delete' && selectionStart < lockedLength) {
            e.preventDefault();
        }

        // Zabránit psaní/vkládání doprostřed zamčeného textu
        if (selectionStart < lockedLength && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            // Skočit na konec před vykonáním klávesy
            consoleArea.setSelectionRange(consoleArea.value.length, consoleArea.value.length);
        }
        
        // ENTER: Simulace odeslání příkazu
        if (e.key === 'Enter') {

            const userInput = consoleArea.value.substring(lockedLength).trim();
            consoleArea.value += promt; 

            setTimeout(() => {
                // Přidáme nový prompt (např. C:\>) a zamkneme ho
                // consoleArea.value += "C:\\>"; 
                lockedLength = consoleArea.value.length;
            }, 10);
        }
    });

    consoleArea.addEventListener('click', () => {
        if (consoleArea.selectionStart < lockedLength) {
            consoleArea.setSelectionRange(consoleArea.value.length, consoleArea.value.length);
        }
    });
});



function commandFunc() {

};