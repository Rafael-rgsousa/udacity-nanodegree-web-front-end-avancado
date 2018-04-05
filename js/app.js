class Base{
    constructor(avatar){
        this.avatar = avatar
    }

}

class Enemy extends Base{

    constructor(name){

        super("")
        this.avatar = this.randomizeAvatar();
        this.name = name;
        this.x = -10 - this.randomInterval(0, 250);
        this.y = 60 + (85 * this.randomInterval(0,2));
        this.minimalSpeed = 400;
        this.maximumSpeed = 500;
        this.speed = this.randomInterval(this.minimalSpeed, this.maximumSpeed);
        this.hit = false;
        this.hitTime = 0;
    }

    /**
     * @description method that returns an avatar
     * @constructor
     * @param none
     */
    randomizeAvatar(){

        let min = Math.ceil(0);
        let max = Math.floor(3);
        let num = Math.floor(Math.random() * (max - min)) + min;

        let value;
        switch(num){
            case 0:
                value = 'images/enemy-bug.png';
                break;

            case 1:
                value = 'images/ladybug.png';
                break;

            case 2:
                value = 'images/ant.png';
                break;
        }

        return value;
    }

    /**
     * @description updates the player's position
     * @constructor
     * @param delta time
     */
    update(dt){
        this.x += this.speed * dt;

        if (this.x > 510) {

            this.x = -10 - this.randomInterval(0, 250);
            this.y = 60 + (85 * this.randomInterval(0, 2));

            this.speed = this.randomInterval(this.maximumSpeed, this.minimalSpeed);
        }

    }

    /**
     * @description draws the Enemy
     * @constructor
     * @param canvas context
     */
    render(ctx){

        ctx.drawImage(Resources.get(this.avatar), this.x, this.y);
        if (this.hit) {
            this.playCollisonAudio();
            if (this.hitTime < 30) {

                this.hitTime += 1;

            } else {
                this.hit = false;
                this.hitTime = 0;
            }
        }
    }

    /**
     * @description returns a pseudo random range
     * @constructor
     * @param value min, value max
     */
    randomInterval(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * @description plays an audio at the time of the collision
     * @constructor
     * @param none
     */
    playCollisonAudio(){
        let audio = new Audio('./../audio/collision.wav');
        audio.play();
    }

}



class Player extends Base{

    constructor(selectedAvatar, difficulty){
        super(selectedAvatar)
        this.col = 0;
        this.row = 5;
        this.conclusion = 0;
        this.lifes = 3;
        this.stage = 1;
        this.expertise = difficulty;
        this.dead = false;
        this.time = 60;
        this.score = 0;
        this.updateTime();
    }

    /**
     * @description return x position
     * @constructor
     * @param none
     */
    x(){
        return this.col * 101;
    }

    /**
     * @description return y position
     * @constructor
     * @param none
     */
    y(){
        return (this.row * 84) - 23;
    }


    /**
     * @description Takes the time count
     * @constructor
     * @param none
     */
    updateTime(){
        setInterval(()=>{
            this.time--;
        }, 1000);

    }

    /**
     * @description check if time is up
     * @constructor
     * @param none
     */
    chekTime(){

        if(parseInt(this.time) == 0){
            this.gameOver();
        }
    }


    /**
     * @description checks for game parameters (points, level) called when the goal is reached
     * @constructor
     * @param none
     */
    updatePlayerConditions(){

        this.stage++;
        this.conclusion+= 10;
        this.row = 5;

        if(this.stage ==1){
            this.time+=2;
        }else if(this.stage >=2){
            this.lifes++;
            this.time+=10;
        }

        this.playAudioLife()

    }

    /**
     * @description checks for game parameters (points, level) called when the goal is reached
     * @constructor
     * @param none
     */
    updatePlayerCollisionConditions(){

        if(this.stage == 1){
            this.time-=10;
            this.lifes --;
        }else if(this.stage == 2){
            this.time -=20;
            this.lifes --;
            this.expertise = 3000.0;
        }else if(this.stage == 3){
            this.time -=15;
            this.lifes -= 2;
            this.expertise = 5000.0;

        }else if(this.stage >= 4){
            this.time --;
            this.lifes-=2;
            this.expertise = 1000.0;

        }

        if(this.lifes <= 0){
            this.dead = true;
            this.gameOver();
        }


    }


    /**
     * @description plays an audio at the time of dead
     * @constructor
     * @param none
     */
    playAudioDead(){
        let audio = new Audio('./../audio/dead.mp3');
        audio.play();
    }

    /**
     * @description set true to dead variable
     * @constructor
     * @param none
     */
    gameOver(){
        this.dead  = true;
    }


    /**
     * @description update allEnemies
     * @constructor
     * @param allEnemies
     */
    update(allEnemies){
        allEnemies.forEach(this.checkCollision, this);
    }


    /**
     * @description verify if has collision
     * @constructor
     * @param element
     */
    checkCollision(element) {
        let playerX = this.x();//one execution
        let playerY = this.y();//one execution
        if (element.x >= playerX - 10 && element.x <= playerX + 10) {
            if (element.y >= playerY - 10 && element.y <= playerY + 10) {
                this.row = 5;
                element.hit = true;
                if(this.conclusion>0){
                    this.conclusion--;
                }else{
                    this.conclusion = 0 ;
                }

                this.updatePlayerCollisionConditions();

            }
        }
    }

    /**
     * @description draw the player
     * @constructor
     * @param canvas context
     */
    render(ctx ){
        this.chekTime();
        ctx.drawImage(Resources.get(this.avatar), this.x(), this.y());
        ctx.font = '20pt impact';
        ctx.fillStyle = 'white';
        ctx.fillText(`Stage:  ${this.stage} Score: ${this.conclusion}  Lifes: ${this.lifes} Time Left: ${this.time}`, 10, 100);
        this.score = this.conclusion;
    }


    /**
     * @description verify keypress
     * @constructor
     * @param keycode
     */
    handleInput(keycode) {

        //right move
        if (keycode === 'right') {
            this.moveAudio();
            this.col += 1;
        }

        //left move
        if (keycode === 'left') {
            this.moveAudio();
            this.col -= 1;
        }

        //delimiter
        if (this.col > 4) {
            this.col = 4;
        }
        //delimiter
        if (this.col < 0) {
            this.col = 0;
        }
        //down move
        if (keycode === 'down') {
            this.moveAudio();
            this.row += 1;
        }
        //up move
        if (keycode === 'up') {
            this.moveAudio();
            this.row -= 1;
        }
        //delimiter
        if (this.row > 5) {
            this.row = 5;
        }

        //success
        if (this.row < 1) {
            this.updatePlayerConditions();
        }
    }

    /**
     * @description play audio when get life
     * @constructor
     * @param none
     */
    playAudioLife(){
        let audio = new Audio('./../audio/life.wav');
        audio.play();
    }


    /**
     * @description play audio when has an move
     * @constructor
     * @param none
     */
    moveAudio(){
        let audio = new Audio('./../audio/move.wav');
        audio.play();
    }

};

