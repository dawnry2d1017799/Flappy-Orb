const block = document.getElementById("block");
const hole = document.getElementById("hole");
const character = document.getElementById("character");
const scoreBoard = document.getElementById("score-display")
const opt_gameover = document.getElementById("option-gameover");
const intervalTimeOutMS = 1;
const jumpAcceleration = 10;

var isJumping = false
var iterationCount = 0
var scoreCounter = 0
var isGameOver = false

function updateScore() {
    scoreCounter++
    scoreBoard.textContent = "Score: " + scoreCounter

}

function holeSizeGenerator() {
    iterationCount++;
    var randomTop = parseInt((Math.random() * 300));
    hole.style.top = randomTop + "px";
    updateScore()
}

function stopAnimation() {
    hole.style.animationPlayState = "paused"
    block.style.animationPlayState = "paused"
}



function showGameOverOption() {
    isGameOver = true
    opt_gameover.style.display = "block"
    document.getElementById("final-score").textContent = "Final Score: " + scoreCounter
    document.getElementById("try-again").addEventListener("click", () => {
        opt_gameover.style.display = "none"
        location.reload()
        displayLog("CLICKED!", 4)
    })
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
    var holeRightPos = holeDimen['left'] + holeDimen['width']
    var blockRightPos = blocksDimen['left'] + blocksDimen['width']

    const isCharacterInHole =
        characterRightPos >= holeDimen['left']
        && characerDimen["left"] <= holeRightPos
        && characerDimen["top"] > holeDimen["top"]
        && characterBotPos < holeBotPos

    const isCharcterHitObstacles =
        blocksDimen['left'] <= characterRightPos
        || characerDimen['top'] <= 0
        || (characerDimen['top'] + characerDimen['height']) >= (blocksDimen['height'] + blocksDimen['top'])

    if (!isCharacterInHole && isCharcterHitObstacles) {
        stopAnimation()
        showGameOverOption()
    }

    displayLog("Character Bot Pos " + (characerDimen['top'] + characerDimen['height']), 2)
    displayLog("Hole Bot Pos " + (blocksDimen['height'] + blocksDimen['top']), 3)
    displayLog("In Hole: " + isCharacterInHole, 0)
    displayLog("Hit Block: " + isCharcterHitObstacles, 1)
    displayLog(" blocksDimen['left']: " + blocksDimen['left'], 4)
    displayLog(" character right : " + characterRightPos, 5)
}

function gravity() {
    const gravityAcceleration = 3;

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
    if (e.keyCode == 32 && !isGameOver) {
        jump()
    }
}

document.body.onclick = (e) => {
    if (!isGameOver) {
        jump()
    }
}


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