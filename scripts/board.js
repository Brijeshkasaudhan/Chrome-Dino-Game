// Game Board
// Player Load, Cactus Load, Floor Load

import Cactus from "./cactus.js";
import { FRAME_RATE, GAME_Height, GAME_WIDTH, MAX, MIN,SPEED,increaseSpeed } from "./config.js";
import Floor from "./floor.js";
import Player from "./player.js";

let isPaused = false;
let isGameOver = false;

//1. Draw a Canvas (Board)
// window (tab)
window.addEventListener('load', gameStart);
let player;
let context;
let floor;
function gameStart(){
    bindEvents();
    prepareCanvas();
    loadSprites();
    gameLoop();
}
function bindEvents(){
    window.addEventListener('keyup',doJump);
}
function doJump(event){
    console.log('Do JUmp call Event ',event.code);
    if(event.code === 'Space'){
        player.jump();
    }
}
function prepareCanvas(){
    const canvas = document.querySelector('#canvas');
    
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_Height;
    context = canvas.getContext('2d');
// canvas.style = "border: 1px solid black";

}
function loadSprites(){
    player = new Player();
    floor = new Floor();
    loadCactus();
}

let cactusArray = [];
function loadCactus(){
    const cactusArr = ['./assets/cactus1.png','./assets/cactus2.png','./assets/cactus3.png'];
    let GAP = 1;

    for(var c of cactusArr){
        const cactus = new Cactus(GAME_WIDTH * GAP, GAME_Height , 48, 100,c);
        GAP++;
        cactusArray.push(cactus);
    }
}

function generateRandomNumber(){
    return Math.floor(Math.random() * MAX - MIN +1) + MIN;
}
let delay = 0;
function generateRandomCactus(){
    if(delay >= 70){
            delay = 0;
    setTimeout(() => {
        loadCactus();
        // cactusArray.push(new Cactus(GAME_WIDTH * GAP, GAME_Height-10, 48, 100,c));
    },generateRandomNumber());
  }
  delay++;
}

function printCactus(context){
    // console.log('Cactus Array size',cactusArray.length);
    for(let cactus of cactusArray){
        cactus.draw(context);
    }
}
function removeUnwantedCactus(){
    cactusArray = cactusArray.filter(c => !c.isOutOfScreen());
}

function printGameOver(){
    context.font = 'bold 48px serif';
    context.fillStyle = 'grey';
    context.fillText('Game Over', GAME_WIDTH / 2.5, GAME_Height / 2);
} 
function gameLoop(){
    // console.log('Game Loop')
    if (isPaused) {
        // Game paused, don’t update anything
        requestAnimationFrame(gameLoop);
        return;
    }
    clearScreen();
    if(isCollisionHappen()){
        isGameOver = true;
        player.draw(context);
        floor.draw(context);
        printCactus(context);
        generateRandomCactus();
        removeUnwantedCactus();
        printGameOver();
        score();
        return;

    }
    else{
    player.draw(context);
    floor.draw(context);
    printCactus(context);
    generateRandomCactus();
    removeUnwantedCactus();
    score();
    setTimeout(function() {
        requestAnimationFrame(gameLoop);
    }, FRAME_RATE);
}
}
let scoreValue =0;
let mileStoneReached = false;
function score(){
    if(!localStorage.maxScore){
        localStorage.maxScore = scoreValue;
    }
    if(scoreValue > localStorage.maxScore){
        localStorage.maxScore = scoreValue;
    }
    scoreValue++;

    // ---- Increase speed every 100 points ----
    if(scoreValue % 100 === 0 && scoreValue !== 0 && !mileStoneReached){
        increaseSpeed(3);     // SPEED += 5;
        mileStoneReached = true;
        console.log("Speed boosted! Current SPEED:", SPEED);
    }
    if(scoreValue % 100 !== 0){
        mileStoneReached = false;
    }

    context.font = 'bold 20px serif';
    context.fillStyle = 'grey';
    context.fillText(scoreValue.toString().padStart(5,0), GAME_WIDTH - 100, 40 );
    context.fillText(localStorage.maxScore.toString().padStart(5,0), GAME_WIDTH - 200, 40 );
}
function clearScreen(){
    context.fillStyle = 'white';
    context.fillRect(0, 0, GAME_WIDTH, GAME_Height);
}

function isCollied(cactus){
     return (player.x < cactus.x + cactus.w && 
        player.x + player.w > cactus.x && 
        player.y < cactus.y +cactus.h && 
        player.y + player.h > cactus.y
    );
}

function isCollisionHappen(){
    return cactusArray.some(c => isCollied(c));
    // for(let cactus of cactusArray){
    //     if(isCollied(cactus)){
    //         return true;
    //     } 
    // }
    // return false;
}

function pauseGame() {
    isPaused = true;
}

function playGame() {
    if (isGameOver) {
        restartGame();      // auto restart if game over
        return;
    }

    isPaused = false;
    requestAnimationFrame(gameLoop);
}
function restartGame() {
    isPaused = false;
    isGameOver = false;
    scoreValue = 0;
    cactusArray = [];

    loadSprites();
    requestAnimationFrame(gameLoop);
}

window.playGame = playGame;
window.pauseGame = pauseGame;