const startButton = document.querySelector(".startButton");

let score = 0;

startButton.addEventListener("click", () => {
    container.appendChild(targetBoard);

    startButton.innerText = "SCORE : " + score;
})