import React, { useState, useRef, useEffect } from 'react';

export default function Canvas() {
    // const [location, setLocation] = useState([])
    // const [count, setCount] = useState(0);
    const canvasEl = useRef(null)


    //context stores 2d context of canvas el itself
    let ctx = null;
    //tile width and height of each tile drawn to map in px
    let tileW = 40, tileH = 40
    //map width and height in tiles
    let mapW = 21, mapH = 21


    //track frame rate
    let currentSecond = 0, frameCount = 0, framesLastSecond = 0
    //keeps track of time
    let lastFrameTime = 0

    //maps the event codes of arrow keys on keyboard to boolean flags for whether or not the key is currently pressed down, to being all values are false 
    let keysDown = {
        37: false, //left
        38: false, //down 
        39: false, //right
        40: false //up
    }

    //player will be a new instance of the Character class we will create in a moment
    //allows us to create new chracters if needed
    let player = new Character()



    // //array stores all map tiles which will make up our map
    // //0 is not passable, 1 is passable
    // //we've laid map out in columns and rows corresponding to how they will appear on map itself

    let gameMapArr = [[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0], [0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0], [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0], [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]]

    let gameMap = gameMapArr.flat()


    // //character class keeps track of charcter's current tile position, destination tile
    // //time at which movement began to dest tile, dimensions of chatacter in pixels
    // // the exact position of the character relative to top left corner of map in px
    // //delay move is time it will take character to move exactly 1 time in ms
    // //char class has a placeAt method - this method wil immed place character at destinaiton tile, takes 2 args, the x and y position where to place the character

    function Character() {
        this.tileFrom = [1, 1];
        this.tileTo = [1, 1];
        this.timeMoved = 0;
        this.dimensions = [30, 30]
        this.position = [45, 45]
        this.delayMove = 700

    }

    Character.prototype.placeAt = function (x, y) {
        this.tileFrom = [x, y]
        this.tileTo = [x, y]
        //calc x and y pixel postion of character by multiplying width of  atile by x value
        //and to this we add width of tile subtracting the character's width and divinng this by 2
        //similarly for y
        this.position = [((tileW * x) + (tileW - this.dimensions[0]) / 2), ((tileH * y) + (tileH - this.dimensions[1]) / 2)]

    }





    useEffect(() => {

        const canvas = canvasEl.current;
        console.log('this is the canvas', canvas)

        let ctx = canvas.getContext('2d')
        console.log('this is the context', ctx)

        //when its ready for us to begin drawing to canvas, we'll handle with drawGamefunction
        requestAnimationFrame(drawGame)
        ctx.font = 'bold 10pt sans-serif'
        console.log('use effect running')

        //add additional event to window onload function
        //keydown occurs whenever a button is pressed down
        window.addEventListener('keydown', function (e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                //update keys down map
                keysDown[e.keyCode] = true
            }

        })
        //occurs when a key is released
        window.addEventListener('keyup', function (e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                //update keys down map to false
                keysDown[e.keyCode] = false
            }
        })


        //draw tiles that make up game map
        //beign by looping through each tile
        for (let y = 0; y < mapH; y++) {
            //for each row, go left to right 
            for (let x = 0; x < mapW; x++) {
                //switch statement lets us choose which color to draw curent tile with
                //find value at corresponding game map index by y*mapW and add x
                switch (gameMap[((y * mapW) + x)]) {
                    case 0:
                        ctx.fillStyle = "#999999";
                        break;
                    default:
                        ctx.fillStyle = "#eeeeee"
                }
                //draw rectangle at coresponding position tile
                ctx.fillRect(x * tileW, y * tileH, tileW, tileH)

            }
        }

        ctx.fillStyle = "#0000ff"
        ctx.fillRect(player.position[0], player.position[1], player.dimensions[1], player.dimensions[1]);

        //finally set fill style to bright red
        ctx.fillStyle = "#ff0000"
        //draw current frame rate
        ctx.fillText("FPS: " + framesLastSecond, 10, 20)



        lastFrameTime = currentFrameTime;


    })

    let currentFrameTime = Date.now()

    //draw game function
    function drawGame() {

        console.log('drawing game')
        //is ctx variable null? if so, leave
        if (ctx == null) {
            return
        }
        // //curent time in ms
        // let currentFrameTime = Date.now()
        //elapsed time since last frame time in ms
        let timeElapsed = currentFrameTime - lastFrameTime

        //calc cur sec, used to keep track of fraame rate in game
        let sec = Math.floor(Date.now() / 1000)
        //if sec is not equal to currentSecond
        // then we update currentSec accordingly and frame count for frame count's last sec will be assigned
        if (sec != currentSecond) {
            currentSecond = sec;
            framesLastSecond = frameCount;
            frameCount = 1;
        } else {
            //increase frame count
            frameCount++;
        }



    }




    //when ready to draw another animation to canvas, draw this again
    requestAnimationFrame(drawGame)

    return (
        <canvas ref={canvasEl} width='1000px' height='1000px' style={{ border: '1px solid red' }} ></canvas>

    )


}