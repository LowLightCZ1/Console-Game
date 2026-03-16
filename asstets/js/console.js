fetch('../asstets/json/commands.json')
.then(res => res.json())
.then(command => {
    const consoleArea = document.getElementById("consoleArea");
    const startCd = command.find(cd => cd.cd1);

    consoleArea.value = startCd ? startCd.cd1 : "start_message_error:404";


});


