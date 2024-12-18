

var gBoard
var LIVES = '❤️'
var SMILEY = '😃'
var BOMB_SMILEY = '🤯'
var FLAG = '🚩'

var userLives = 3
var userHints = 3
var isFirstClick = true

var evv
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
  gBoard = createBoard(4, 4)
  renderBoard(gBoard, '.board-container')

  console.log(gBoard)
  //console.log(findEmptyPos(gBoard))
  //console.log(setMinesNegsCount(gBoard, 2, 2))


}



function onCellClicked(elCell, i, j) {
  const cell = gBoard[i][j]
  console.log(elCell)
  if (cell.isMarked) return

  if (cell.isMine) {
    if (isFirstClick) {
      cell.isMine = false
      drawnRandomMines(gBoard, 1)
      renderBoard(gBoard, '.board-container')
      gGame.shownCount = 0
      return
    }
    userLives--
    elSmailtBtn = document.querySelector('.smiley-btn')
    elSmailtBtn.innerText = BOMB_SMILEY
    setTimeout(() => {
      elSmailtBtn.innerText = SMILEY
    }, 2000);
    isFirstClick = false
    console.log(userLives)
  }

  if (!cell.isMine) {
    isFirstClick = false
    console.log(cell)
  }

  elSpanContent = elCell.querySelector(`span`)
  elSpanContent.style.display = 'block'
  elCell.classList.add('marked-cell')
  cell.isShown = true
  gGame.shownCount++


}


function onRestartGame() {
  gGame.isOn = true
  userLives = 3
  userHints = 3
  isFirstClick = true
  gBoard = createBoard(gLevel.SIZE, gLevel.SIZE)
  renderBoard(gBoard, '.board-container')
}

function onCellMarked(elCell, ev, i, j) {
  ev.preventDefault()
  var cell = gBoard[i][j]
  if (!cell.isMarked) {
    elCell.innerText = FLAG
    cell.isMarked = true
  } else {
    elCell.innerText = ''
    cell.isMarked = false
  }


}

function checkGameOver() {
  return (gLevel.MINES === gGame.markedCount && gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES)
}
