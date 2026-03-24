const consoleArea = document.getElementById("consoleArea");

fetch('../asstets/json/commands.json')
.then(res => res.json())
.then(command => {
    const name = localStorage.getItem("nameValue") || "User";
    const prompt = `${name} :`;

    console.log(name)

    const startCd = command.find(cd => cd.cd1);
    const welcomeMessage = startCd ? startCd.cd1.replace("{name}", name) : "Welcome to the game";

    consoleArea.value = welcomeMessage + "\n" + prompt;
    consoleArea.focus();

    consoleCom(command);
});


function consoleCom(commandDAta){
    
}