document.getElementById("gameBtn").addEventListener("click", function () {
    const name = document.getElementById("nameInput").value.trim();

    if (!name) {
        alert("Please enter your name!");
        return;
    }

    localStorage.setItem("nameValue", name);
    window.location.href = "../public/game.html"; // Navigate manually
});
