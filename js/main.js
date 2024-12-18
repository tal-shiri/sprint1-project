

var gBoard
var LIVE = '❤️'
var SMILEY = '😃'
var BOMB_SMILEY = '🤯'
var FLAG = '🚩'
var MINE = '💣'

var gUserLives = 1
var gUserHints = 3
var isFirstClick = true

var gLevel = {
  SIZE: 4,
  MINES: 2
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
}

function onInit() {
  gGame.isOn = true
  gBoard = createBoard(4, 4)
  renderBoard(gBoard, '.board-container')

  console.log(gBoard)
  //console.log(findEmptyPos(gBoard))
  //console.log(setMinesNegsCount(gBoard, 2, 2))


}



function onCellClicked(elCell, i, j) {

  const cell = gBoard[i][j]
  elSpanContent = elCell.querySelector(`span`)

  if (!gGame.isOn) return
  //console.log(elCell)
  if (cell.isMarked) return

  if (cell.isMine) {
    if (isFirstClick) {
      cell.isMine = false
      drawnRandomMines(gBoard, 1)
      renderBoard(gBoard, '.board-container')
      gGame.shownCount = 0
      return
    }
    gUserLives--
    console.log(gUserLives)
    onRemoveLiveCount()
    onSmileyBombAnimation()


    isFirstClick = false

  }

  if (!cell.isMine) {
    isFirstClick = false
    elSpanContent.innerText = cell.minesAroundCount

  }


  //console.log(elCell)
  elSpanContent.style.display = 'block'
  elCell.classList.add('marked-cell')
  cell.isShown = true
  gGame.shownCount++
  checkGameOver()


  console.log()



}


function onRestartGame() {
  gGame.isOn = true
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.shownCount = 0
  gUserLives = 1
  gUserHints = 3
  isFirstClick = true
  var elGameOver = document.querySelector('.game-over')
  elGameOver.style.display = 'none'
  const elLives = document.querySelector('.lives');
  elLives.innerText = '❤️❤️❤️'
  gBoard = createBoard(gLevel.SIZE, gLevel.SIZE)
  renderBoard(gBoard, '.board-container')
}

function onCellMarked(elCell, ev, i, j) {
  ev.preventDefault()
  var cell = gBoard[i][j]
  if (cell.isMine && cell.isShown) return
  elSpanContent = elCell.querySelector(`span`)
  elSpanContent.style.display = 'block'


  if (!cell.isMarked) {
    elSpanContent.innerText = FLAG
    cell.isMarked = true
    gGame.markedCount++
  } else {
    elSpanContent.innerText = (cell.isMine) ? MINE : ''
    elSpanContent.style.display = 'none'
    cell.isMarked = false
    gGame.markedCount--
    console.log(elCell.innerText)
  }

  checkGameOver()
}

function checkWin() {
  return (gLevel.MINES === gGame.markedCount && gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES)
}

function checkGameOver() {
  console.log(gUserLives)
  if (gUserLives === 0) {
    gGame.isOn = false
    gameOverPopUp('You Lose')
    showAllMines()
    return
  }
  if ((checkWin())) {
    gGame.isOn = false
    console.log('dd')
    gameOverPopUp('You win')
    return
  }
}

function expandShown(board, elCell, i, j) {

}


function gameOverPopUp(str) {
  var elSpanGameOver = document.querySelector('.game-over span')
  var elGameOver = document.querySelector('.game-over')
  elSpanGameOver.innerText = str
  elGameOver.style.display = 'block'
}

function onSmileyBombAnimation() {
  elSmailtBtn = document.querySelector('.smiley-btn')
  elSmailtBtn.innerText = BOMB_SMILEY
  setTimeout(() => {
    elSmailtBtn.innerText = SMILEY
  }, 2000);
}

function onChangeLevel(elBtn) {
  var level = elBtn.innerText
  console.log(level)
  switch (level) {
    case 'Beginner':
      gLevel.SIZE = 9
      gLevel.MINES = 2
      onRestartGame()
      break;
    case 'Intermediate':
      gLevel.SIZE = 8
      gLevel.MINES = 14
      onRestartGame()
      break;
    case 'Expert':
      gLevel.SIZE = 12
      gLevel.MINES = 32
      onRestartGame()
      break;
    case 'Custom':
      gLevel.SIZE = 9
      gLevel.MINES = 2
      onRestartGame()
      break;

    default:
      break;
  }
}

function onRemoveLiveCount() {

  const elLives = document.querySelector('.lives');
  switch (gUserLives) {
    case 2: elLives.innerText = '❤️❤️'
      break;
    case 1: elLives.innerText = '❤️'
      break;
    default: elLives.innerText = '😵'
      break;
  }

}

function showAllMines() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      const cell = gBoard[i][j];
      if (cell.isMine) {
        var elCell = document.querySelector(`.cell-${i}-${j} span`)
        elCell.style.display = 'block'
        elCell.style.backgroundColor = 'red'
        elCell.innerText = MINE

      }
    }
  }
}