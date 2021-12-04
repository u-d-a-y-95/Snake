
const gameConfig = {
    boardWidth: 50,
    boardHeight: 25,
    cellSize: 10,
    snakeSize: 3,
    snakeSpeed: 10 ,
    cellBorder: true,
    foodColor: 'green',
    SnakeColor: ""
}

let direction = { x: -1, y: 0 }
let snake = []
let interval = null
let isGameRunning = false
let score = 0;



const board = document.getElementById('board')
const playPauseBtn = document.getElementById('playPauseBtn')
const resetBtn = document.getElementById('resetBtn')
const scoreText = document.getElementById('scoreText')
const banner = document.getElementById("banner")
// let startPos = (Math.floor(boardSize/2) - Math.floor(snakeSize/2))

const generateBoard = (boardWidth = 10, boardHeight = 10, cellSize = 5, cellBorder = true) => {
    for (let i = 0; i < boardHeight; i++) {
        const rowTile = document.createElement('div')
        rowTile.classList.add('d-flex')
        for (let j = 0; j < boardWidth; j++) {
            const cellTile = document.createElement('div')
            cellTile.style.width = `${cellSize}px`
            cellTile.style.height = `${cellSize}px`
            if (cellBorder) {
                cellTile.classList.add('border')
            }
            rowTile.appendChild(cellTile)
        }
        board.appendChild(rowTile)

    }

    // board.classList.add('border')

}


const generateSnake = (boardWidth, boardHeight, snakeSize) => {
    const headPos = { x: Math.floor(boardWidth / 2) - Math.floor(snakeSize / 2), y: Math.floor(boardHeight / 2) }
    for (let i = 0; i < snakeSize; i++) {
        snake.push({ ...headPos })
        board.children[snake[i].y].children[snake[i].x].style.backgroundColor = i == 0 ? 'red' : 'black'
        board.children[snake[i].y].children[snake[i].x].attributes.isSnakePart = true
        headPos.x += 1
    }

}

const generateFood = (boardWidth, boardHeight, foodColor) => {
    const x = Math.floor(Math.random() * boardWidth)
    const y = Math.floor(Math.random() * boardHeight)
    console.log(x, y)
    if (board.children[y].children[x].attributes.isSnakePart == 1) {
        generateFood(boardWidth, boardHeight, foodColor)
    } else {
        board.children[y].children[x].attributes.isSnakePart = 2
        board.children[y].children[x].style.backgroundColor = foodColor
    }
}



const updateSnakePosition = (headPos) => {
    let isEat = false
    for (let i = 0; i < snake.length; i++) {
        const nextPos = snake[i]
        snake[i] = headPos
        headPos = nextPos

        if(i == 0 && (snake[i].x<0 ||  snake[i].x>=gameConfig.boardWidth || snake[i].y<0 || snake[i].y>=gameConfig.boardHeight)){
            stopGame()
            banner.style.display="flex"
            return;
        }

        if (i == 0 && board.children[snake[i].y].children[snake[i].x].attributes.isSnakePart == 1) {
            stopGame()
            banner.style.display="flex"
            return
        }
        if (i == 0 && board.children[snake[i].y].children[snake[i].x].attributes.isSnakePart == 2) {
            isEat = true
        }

        board.children[snake[i].y].children[snake[i].x].style.backgroundColor = i == 0 ? "red" : "black";
        board.children[snake[i].y].children[snake[i].x].attributes.isSnakePart = 1
    }
    if (isEat) {
        snake.push({ ...headPos })
        generateFood(gameConfig.boardWidth, gameConfig.boardHeight, gameConfig.foodColor)
        score ++ 
        scoreText.textContent = score

    } else {
        board.children[headPos.y].children[headPos.x].style.backgroundColor = "white"
        board.children[headPos.y].children[headPos.x].attributes.isSnakePart = 0
    }


}


const startGame = () => {
    interval = setInterval(() => {
        updateSnakePosition({ x: snake[0].x + direction.x, y: snake[0].y + direction.y })
    }, 1000/gameConfig.snakeSpeed)
}

const stopGame = () => {
    clearInterval(interval)
}


const playPauseBtnHandler = () => {
    if (isGameRunning) {
        playPauseBtn.textContent = 'Play'
        playPauseBtn.classList.toggle("bg-green")
        playPauseBtn.classList.toggle("bg-red")
        stopGame()
    } else {
        playPauseBtn.textContent = 'Pause'
        playPauseBtn.classList.toggle("bg-green")
        playPauseBtn.classList.toggle("bg-red")
        startGame()
    }
    isGameRunning = !isGameRunning
}


const setGame = () => {
    direction = { x: -1, y: 0 }
    snake = []
    interval = null
    isGameRunning = false
    score = 0;
    board.innerHTML = ""
    generateBoard(gameConfig.boardWidth, gameConfig.boardHeight, gameConfig.cellSize, gameConfig.cellBorder)
    snake.length = 0
    generateSnake(gameConfig.boardWidth, gameConfig.boardHeight, gameConfig.snakeSize)
    generateFood(gameConfig.boardWidth, gameConfig.boardHeight, gameConfig.foodColor)
    scoreText.textContent = score
    playPauseBtn.textContent= "Play"
    playPauseBtn.classList.remove('bg-red')
    playPauseBtn.classList.add('bg-green')
    banner.style.display = ""
}


const resetBtnHandler = () => {
    stopGame()
    setGame()

}

setGame()

// startGame()


document.addEventListener('keyup', (e) => {
    console.log(e.keyCode)
    if (e.keyCode == 37 || e.keyCode == 39) {
        if (!direction.x) {
            direction.x = e.keyCode == 37 ? -1 : 1;
            direction.y = 0
        }
    } else if (e.keyCode == 38 || e.keyCode == 40) {
        if (!direction.y) {
            direction.x = 0;
            direction.y = e.keyCode == 38 ? -1 : 1
        }
    } else if (e.keyCode == 16) {
        playPauseBtnHandler()
    }
    else if (e.keyCode == 13) {
        resetBtnHandler()
    }

})


playPauseBtn.addEventListener('click', () => {
    playPauseBtnHandler()
})

resetBtn.addEventListener('click', resetBtnHandler)







