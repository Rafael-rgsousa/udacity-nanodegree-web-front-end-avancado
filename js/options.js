var avatarOptions = new Array(
    {name: 'Boy', path: 'char-boy.png'},
    {name: 'Horn Girl', path: 'char-horn-girl.png'},
    {name: 'Pink Girl', path: 'char-pink-girl.png'},
    {name: 'Princess', path: 'char-princess-girl.png'}
);

/**
 * @description method that receives the avatar of the new player
 * @constructor
 * @param none
 */
function changePlayerImage() {

    selectedAvatar = this.value;

    return false;

}

/**
 * @description method that receives the level of difficulty of the new player
 * @constructor
 * @param none
 */
function setDifficulty() {
    // console.log(this.value)
    switch (parseInt(this.value)) {
        case 1:
            difficulty = 5000.0;
            break;

        case 2:
            difficulty = 3000.0;
            break;

        case 3:
            difficulty = 1000.0;
            break;

        case 4:
            difficulty = 800.0;
            break;

        case 5:
            difficulty = 500.0;
            break;
    }

}


/**
 * @description method that performs the initial settings
 * @constructor
 * @param none
 */
function initGame() {


    if (!selectedAvatar) {
        alert("Set your avatar!");
        return false;
    }

    if (!difficulty) {
        alert("Set your difficulty level!");
        return false;
    }

    const player = new Player(selectedAvatar, difficulty);
    const allEnemies = [
        new Enemy("Joao"),
        new Enemy("Carlos"),
        new Enemy("Maria"),
        new Enemy("Jose"),
        new Enemy("Pedro")
    ];

    document.addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });

    Engine(window, player, allEnemies);


    return false;
}


document.getElementById("level").onchange = setDifficulty;

document.getElementById("playerList").onchange = changePlayerImage;

document.getElementById("startButton").onclick = initGame;