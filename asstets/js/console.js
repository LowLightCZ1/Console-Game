fetch('../asstets/json/commands.json')
.then(res => res.json())
.then(command => {
    const console = document.getElementById("consoleArea");
    console.value = command.cd1;

})

