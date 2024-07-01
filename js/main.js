// dropdown menubalk

function myFunction(dropdownId){
    document.getElementById(dropdownId).classList.toggle("show");
}

window.onclick = function(e){
    if (!e.target.matches('.dropbtn')){
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for(var i = 0; i <dropdowns.length; i++){
            var openDropdown = dropdowns [i];

            if(openDropdown.classList.contains('show')){
                openDropdown.classList.remove('show')
            }
        }
    }
};


// idee 1: checkbutton 

document.addEventListener("DOMContentLoaded", function() {
    const button = document.getElementById("myButton");
    const checkIcon = document.getElementById("checkIcon");
    const container = document.querySelector(".beginscherm");

    button.addEventListener("click", function() {
        container.style.backgroundColor = "rgb(255, 235, 51)";
        container.style.backgroundImage = "none";
        checkIcon.classList.remove("hidden");
        checkIcon.classList.add("visible");
        button.style.display = "none"; 

        setTimeout(function() {
            container.style.backgroundColor = "";
            container.style.backgroundImage = "url('/images/beginscherm.png')";
            checkIcon.classList.remove("visible");
            checkIcon.classList.add("hidden");
            button.style.display = "block"; 
        }, 1000); 
    });
});

// idee 2: stoplicht

window.addEventListener('DOMContentLoaded', () => {
    const roodAuto = document.getElementById('rood');
    const oranjeAuto = document.getElementById('oranje');
    const groenAuto = document.getElementById('groen');
    const gameArea = document.getElementById('game-area');
    const playerCar = document.getElementById('player-car');
    const scoreBoard = document.getElementById('score-board');
    const scoreDisplay = document.getElementById('score');
    const autoContainer = document.getElementsByClassName('auto');

    let isGameRunning = false;
    let roodGeklikt = false;
    let oranjeGeklikt = false;
    let score = 0;
    let obstacleSpeed = 5; 
    let obstacleInterval;
    let coinInterval;

    // Functie om obstakels te maken
    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = `${Math.random() * (gameArea.offsetWidth - 50)}px`;
        gameArea.appendChild(obstacle);

        setTimeout(() => {
            if (gameArea.contains(obstacle)) {
                gameArea.removeChild(obstacle);
            }
        }, 5000 / obstacleSpeed * 1000);
    }

    // Functie om munten te maken
    function createCoin() {
        const coin = document.createElement('div');
        coin.classList.add('coin');
        coin.style.left = `${Math.random() * (gameArea.offsetWidth - 50)}px`;
        gameArea.appendChild(coin);

        setTimeout(() => {
            if (gameArea.contains(coin)) {
                gameArea.removeChild(coin);
            }
        }, 5000 / obstacleSpeed * 1000);
    }

    // Functie om de auto te bewegen
    function moveCar(event) {
        if (!isGameRunning) return;

        const gameAreaWidth = gameArea.offsetWidth;
        const playerCarWidth = playerCar.offsetWidth;
        let playerCarLeft = parseFloat(window.getComputedStyle(playerCar).left);

        switch(event.key) {
            case 'ArrowLeft':
                if (playerCarLeft > 0) {
                    playerCarLeft -= 10;
                    playerCar.style.left = `${playerCarLeft}px`;
                }
                break;
            case 'ArrowRight':
                if (playerCarLeft < gameAreaWidth - playerCarWidth) {
                    playerCarLeft += 10;
                    playerCar.style.left = `${playerCarLeft}px`;
                }
                break;
        }
    }

    // Event luisteraar voor toetsenbord input
    const keydownHandler = (event) => {
        if (isGameRunning) {
            moveCar(event);
        }
    };

    // Functie om het spel te starten
    function startGame() {
        const gameAreaWidth = gameArea.offsetWidth;
        const playerCarWidth = playerCar.offsetWidth;
        const playerCarLeft = gameAreaWidth / 2 - playerCarWidth / 2;
        playerCar.style.left = `${playerCarLeft}px`;

        document.addEventListener('keydown', keydownHandler);
        score = 0; 
        scoreDisplay.textContent = score; 
        obstacleInterval = setInterval(createObstacle, 2000);
        coinInterval = setInterval(createCoin, 3000);
        checkCollision();
    }

    // Functie om te controleren op botsingen
    function checkCollision() {
        const obstacles = document.getElementsByClassName('obstacle');
        const coins = document.getElementsByClassName('coin');
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            const obstacleRect = obstacle.getBoundingClientRect();
            const playerCarRect = playerCar.getBoundingClientRect();

            if (
                obstacleRect.left < playerCarRect.right &&
                obstacleRect.right > playerCarRect.left &&
                obstacleRect.top < playerCarRect.bottom &&
                obstacleRect.bottom > playerCarRect.top
            ) {
                isGameRunning = false;
                restartGame(); // Start het spel opnieuw of ga door
                return;
            }
        }
        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i];
            const coinRect = coin.getBoundingClientRect();
            const playerCarRect = playerCar.getBoundingClientRect();

            if (
                coinRect.left < playerCarRect.right &&
                coinRect.right > playerCarRect.left &&
                coinRect.top < playerCarRect.bottom &&
                coinRect.bottom > playerCarRect.top
            ) {
                gameArea.removeChild(coin);
                score++;
                scoreDisplay.textContent = score;
            }
        }

        if (isGameRunning) {
            requestAnimationFrame(checkCollision);
        }
    }

    // Functie om het spel te stoppen
    function stopGame() {
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);
        document.removeEventListener('keydown', keydownHandler);
    }

    // Functie om het spel opnieuw te starten na het einde
    function restartGame() {
        isGameRunning = false;
        stopGame();
        const choice = confirm(`Game Over! Je score is ${score}. Wil je opnieuw spelen?`);
        if (choice) {
            // Reset het spel
            const gameAreaWidth = gameArea.offsetWidth;
            const playerCarWidth = playerCar.offsetWidth;
            const playerCarLeft = gameAreaWidth / 2 - playerCarWidth / 2;
            playerCar.style.left = `${playerCarLeft}px`;
            score = 0;
            scoreDisplay.textContent = score;
            // Verwijder alle obstakels en munten uit het spelgebied
            const obstacles = document.querySelectorAll('.obstacle');
            obstacles.forEach(obstacle => obstacle.remove());
            const coins = document.querySelectorAll('.coin');
            coins.forEach(coin => coin.remove());
            // Start het spel opnieuw
            isGameRunning = true;
            obstacleInterval = setInterval(createObstacle, 2000);
            coinInterval = setInterval(createCoin, 3000);
            checkCollision();
            document.addEventListener('keydown', keydownHandler);
        } else {
            window.location.href = 'homepage.html'; 
        }
    }

    // Functie om het spelgebied uit te breiden
    function expandGameArea() {
        document.body.style.margin = '0';
        document.body.style.overflow = 'auto';
        const extraPlaatje = document.querySelectorAll('.extra-plaatje');

        // Verberg andere elementen op de pagina
        roodAuto.style.display = 'none';
        oranjeAuto.style.display = 'none';
        groenAuto.style.display = 'none';
        extraPlaatje.forEach(auto => auto.style.display = 'none');

        // Stijl voor het uitgebreide spelgebied
        gameArea.style.position = 'fixed';
        gameArea.style.top = '50%';
        gameArea.style.left = '50%';
        gameArea.style.transform = 'translate(-50%, -50%)';
        gameArea.style.height = '80vh';
        gameArea.style.backgroundImage = 'url(/images/weg.png)';
    }

    // Functie om auto's te laten schudden bij het laden van de pagina
    function startShaking() {
        setTimeout(() => {
            roodAuto.classList.add('shaking');
            roodAuto.addEventListener('animationend', () => {
                roodAuto.classList.remove('shaking');
                roodAuto.addEventListener('click', () => {
                    if (!roodGeklikt) {
                        roodGeklikt = true;
                    }
                });
            }, { once: true });

            setTimeout(() => {
                oranjeAuto.classList.add('shaking');
                oranjeAuto.addEventListener('animationend', () => {
                    oranjeAuto.classList.remove('shaking');
                    oranjeAuto.addEventListener('click', () => {
                        if (roodGeklikt && !oranjeGeklikt) {
                            oranjeGeklikt = true;
                        } else if (!roodGeklikt) {
                            alert('Klik eerst op de rode auto!');
                        }
                    });
                }, { once: true });

                setTimeout(() => {
                    groenAuto.classList.add('shaking');
                    groenAuto.addEventListener('animationend', () => {
                        groenAuto.classList.remove('shaking');
                        groenAuto.addEventListener('click', (event) => {
                            event.preventDefault();
                            if (roodGeklikt && oranjeGeklikt) {
                                isGameRunning = true;
                                expandGameArea();
                                gameArea.classList.remove('hidden');
                                scoreBoard.classList.remove('hidden');
                                startGame(); // Start het spel
                            } else if (!roodGeklikt) {
                                alert('Klik eerst op de rode auto!');
                            } else if (!oranjeGeklikt) {
                                alert('Klik eerst op de oranje auto!');
                            }
                        });
                    }, { once: true });
                }, 1000); // Vertraging voor het schudden van groene auto
            }, 1000); // Vertraging voor het schudden van oranje auto
        }, 1000); // Vertraging voor het schudden van rode auto
    }

    // Start de schudanimatie bij het laden van de pagina
    startShaking();
});



// idee 3: nachtmodes - koplamp

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('nightModeToggle');

    toggle.addEventListener('change', function() {
        document.body.classList.toggle('night-mode');
    });
});

