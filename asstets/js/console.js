const consoleArea = document.getElementById("consoleArea");
let startLength = 0;

fetch('../asstets/json/commands.json')
.then(res => res.json())
.then(commands => {
    const name = localStorage.getItem("nameValue") || "User";

    console.log(name)

    const startCmd = commands.find(cd => cd.start);
    const welcome = startCmd ? startCmd.start.replace("{name}", name) : "Welcome to the game";

    appendLine(welcome);
    appendPrompt(name);

    const cmdMap = Object.assign({}, ...commands.filter(c => !c.start));
    consoleCom(cmdMap, name);

})
.catch(() => {
  const name = localStorage.getItem("nameValue") || "User";
  appendLine("Welcome to Console Game");
  appendPrompt(name);
  consoleCom({}, name);
});


// ── Helpers ── //

function appendLine(text){
    consoleArea.value += (consoleArea.value ? "\n" : "") + text;
    scrollToBottom();
}

function appendPrompt(name){
    consoleArea.value += `\n${name}$>`;
    startLength = consoleArea.value.length;
    scrollToBottom();
}

function scrollToBottom(){
    consoleArea.scrollTop = consoleArea.scrollHeight;
    consoleArea.setSelectionRange(startLength, startLength);
}

function getCurrentInput() {
  return consoleArea.value.slice(startLength);
}


// ────── Tutorial ────── //
function openTutorial() {
  const t = document.getElementById("tutorial");
  t.style.display = 'block';
  t.classList.remove("rolling-out");
  void t.offsetWidth;
  t.classList.add("visible", "rolling");
  t.addEventListener('animationend', () => t.classList.remove("rolling"), { once: true});
}

function closeTutorial(){
  const t = document.getElementById("tutorial");
  t.classList.remove("rolling");
  void t.offsetWidth;
  t.classList.add("rolling-out");
  t.addEventListener('animationend', () => {
    t.classList.remove("rolling-out", "visible");
    t.style.display = "none";
  }, { once: true});
}


// ───────────────────── //

function consoleCom(cmdMap, name){
    // Guard: keep cursor inside editable zone
    consoleArea.addEventListener("click", () =>{
        if(consoleArea.selectionStart < startLength){
            consoleArea.setSelectionRange(startLength, startLength);
        }
    });

    consoleArea.addEventListener("keydown", (e) =>{
        const pos = consoleArea.selectionStart;

        if ((e.key === "ArrowLeft" || e.key === "Home") && pos <= startLength) {
      e.preventDefault();
      return;
    }
 
    // Block Backspace eating into the prompt
    if (e.key === "Backspace" && pos <= startLength) {
      e.preventDefault();
      return;
    }
 
    // Block Delete before editable start
    if (e.key === "Delete" && pos < startLength) {
      e.preventDefault();
      return;
    }
 
    // Ctrl+A selects only current input, not history
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      consoleArea.setSelectionRange(startLength, startLength);
      return;
    }
 
    // Enter: process command
    if (e.key === "Enter") {
      e.preventDefault();
      const input = getCurrentInput().trim();
      processCommand(input, cmdMap, name);
      appendPrompt(name);
    }

    // Tab: comlete command
    if(e.key === "Tab"){
      e.preventDefault();

      const input = getCurrentInput().trim();
      if(!input) return;
      const lower = input.toLowerCase();

      const allCmds = [...new Set(["help", "clear","move","tutorial", ...Object.keys(cmdMap)])];
      const matches = allCmds.filter(cmd => cmd.startsWith(lower));

      if (matches.length === 1) {
        // Replace everything after the prompt with the completed command
        consoleArea.value = consoleArea.value.slice(0, startLength) + matches[0];
        consoleArea.setSelectionRange(consoleArea.value.length, consoleArea.value.length);
      
      } else if (matches.length > 1) {
        appendLine("\n" + matches.join("  "));
        appendPrompt(name);
      
        // Re-type what the user had so far
        consoleArea.value += input;
        consoleArea.setSelectionRange(consoleArea.value.length, consoleArea.value.length);
      }
    }

  });
 
  // Block paste into locked region
  consoleArea.addEventListener("paste", (e) => {
    if (consoleArea.selectionStart < startLength) {
      e.preventDefault();
    }
  });
}
 
// ── Command Logic ────────────────────────────────────────────────────────────
 
function processCommand(input, cmdMap, name) {
  if (!input) return;
 
  const lower = input.toLowerCase();
  

  // "help" — list all available commands from JSON + built-ins
  if (lower === "help") {
    const jsonCmds = Object.keys(cmdMap);
    const allCmds = [...new Set(["help", "clear", ...jsonCmds])];
 
    appendLine("\nAvailable commands:\n");
    allCmds.forEach(cmd => {
      const desc = cmdMap[cmd]?.description || "...";
      appendLine(`  ${cmd.padEnd(6)} - ${desc}`);
    });
    return;
  }
 
  // "clear" — wipe the console
  if (lower === "clear") {
    const action = cmdMap["clear"]?.action;
    if (action) runAction(action, name);
    consoleArea.value = "";
    startLength = 0;
    return;
  }

  //"move x,y - move character on specific grid"

  if(lower.startsWith("move")){
    const args = input.slice(4).trim();
    const match = args.match(/^(\d+)\s*,\s*(\d+)$/);

    if(!match){
      appendLine('\nUsage: move x,y  (e.g. move 3,2)\n');
      return;
    }

    const col = parseInt(match[1], 10);
    const row = parseInt(match[2], 10);

    if(!window.gameAPI){
      appendLine('\nGame not initialised yet.\n');
      return;
    }

    const result = window.gameAPI.moveCharacter(col, row);
    appendLine(
      result.ok ? `\nMoving to (${col}, ${row})...\n` :`\nError: ${result.msg}\n`
    );
    return;
  }

  if(lower === "tutorial"){
    const t = document.getElementById("tutorial");
    const isOpen = t.classList.contains("visible");
    appendLine(isOpen ? "\nClosing tutorial..\n" : "\nOpening tutorial...\n");
    isOpen ? closeTutorial() : openTutorial();
    return
  }

 
  // JSON-defined commands
  if (cmdMap[lower]) {
    const action = cmdMap[lower].action;
    if (action) runAction(action, name);
    return;
  }
 
  appendLine(`\nUnknown command: "${input}". Type "help" for a list of commands.\n`);
}
 
// ── Action Runner ─────────────────────────────────────────────────────────────
// Extend this as you add more action types to your JSON
 
function runAction(action, name) {
  if (!action || action === "...") return;
  // Replace {name} placeholder if present
  appendLine("\n" + action.replace("{name}", name));
}

