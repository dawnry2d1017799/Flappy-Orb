const block = document.getElementById("block");
const hole = document.getElementById("hole");
const character = document.getElementById("character");
const scoreBoard = document.getElementById("score-display")
const intervalTimeOutMS = 1;
const jumpAcceleration = 10;

const animOpt = {
    duration: 2000,
    iterations: Infinity,
    easing: "linear"
}

const animKeyFrame = [{ left: "100vw" }, { left: "-64px" }]

var isJumping = false
var iterationCount = 0
var scoreCounter = 0

function obstaclesAnim(newAnimaKeyFrame = animKeyFrame, newAnimOption = animOpt) {
    block.animate(animKeyFrame, animOpt);
    hole.animate(animKeyFrame, animOpt)
}

function holeSizeGenerator() {
    iterationCount++;
    var randomTop = parseInt((Math.random() * 300));
    var animSpeedFactor = (iterationCount * 1000) + 2000

    const newAnimOpt = {
        duration: animSpeedFactor,
        iterations: Infinity,
        easing: "linear"
    }

    hole.style.top = randomTop + "px";
    // obstaclesAnim(animKeyFrame, newAnimOpt)
    displayLog(animSpeedFactor, 2)

}


function getDimen(element) {
    var top = parseInt(window.getComputedStyle(element).getPropertyValue("top"))
    var left = parseInt(window.getComputedStyle(element).getPropertyValue("left"))
    var height = parseInt(element.getBoundingClientRect().height)
    var width = parseInt(element.getBoundingClientRect().width)
    var marginLeft = parseInt(window.getComputedStyle(element).getPropertyValue("margin-left"))
    var right = parseInt(window.getComputedStyle(element).getPropertyValue("right"))


    return {
        "right": right,
        "top": top,
        "left": left,
        "height": height,
        "width": width,
        "marginLeft": marginLeft
    }
}

function hitDetector() {
    const characerDimen = getDimen(character)
    const holeDimen = getDimen(hole)
    const blocksDimen = getDimen(block)

    var holeBotPos = holeDimen["top"] + holeDimen["height"]
    var characterBotPos = characerDimen["top"] + characerDimen["height"]
    var characterRightPos = characerDimen['marginLeft']
        + characerDimen['width']
        + characerDimen['left']

    const isCharacterInHole = (characterRightPos >= holeDimen['left']
        && characterRightPos <= (holeDimen['left'] + holeDimen['width']))
        && characerDimen["top"] > holeDimen["top"]
        && characterBotPos < holeBotPos

    const isCharcterHitObstacles = blocksDimen['left'] <= (characerDimen["width"] + characerDimen["marginLeft"])
        || characerDimen['top'] <= 0
        || (characerDimen['top'] + characerDimen['height']) >= (blocksDimen['height'] + blocksDimen['top'])

    if (isCharacterInHole && isCharcterHitObstacles) {
        scoreCounter++
        scoreBoard.textContent = "Score: " + scoreCounter
    }

    displayLog("In Hole: " + isCharacterInHole, 0)
    displayLog("Hit Block: " + isCharcterHitObstacles, 1)
}

function gravity() {
    const gravityAcceleration = 5;

    var objTopPos = parseInt(
        window.getComputedStyle(character)
            .getPropertyValue("top"))

    if (objTopPos < 580 && !isJumping) {
        character.style.top = (objTopPos + gravityAcceleration) + "px"
    }

    hitDetector(hole, character)
}

function jump() {
    var jumpCounter = 0;
    isJumping = true

    var jumpInterval = setInterval(() => {
        var objTopPos = parseInt(
            window.getComputedStyle(character)
                .getPropertyValue("top"))

        character.style.top = (objTopPos - jumpAcceleration) + "px"

        if (jumpCounter > 5) {
            clearInterval(jumpInterval)
            isJumping = false
        }

        jumpCounter++
    }, intervalTimeOutMS)
}

document.body.onkeyup = (e) => {
    if (e.keyCode == 32) {
        jump()
    }
}


obstaclesAnim()
block.addEventListener("animationiteration", holeSizeGenerator)
setInterval(gravity, intervalTimeOutMS)


//Debug
function displayLog(logMsg, logNumber) {
    var logs = []

    for (i = 1; i <= 6; i++) {
        logs.push(document.getElementById("log-" + i))
    }

    logs[logNumber].textContent = logMsg
}