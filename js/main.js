

var gBoard
var LIVE = '❤️'
var SMILEY = '😃'
var BOMB_SMILEY = '🤯'
var FLAG = '🚩'
var MINE = '💣'

var gUserLives = 3
var gUserHints = 3
var gSafeClicks = 3
var isFirstClick = true
var isCustomBtnSelected = false
var isRegisterBtnSelected = false
let gStartTime
let gTimerInterval
var onBtnHintToRemove
var isTimeOn = false
var isHintOn = false
var gCurrUsername = ''



var gLevel = {
  levelName: 'beginner',
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
  stopTimer()
  renderBoard(gBoard, '.board-container')

  console.log(gBoard)
  //console.log(findEmptyPos(gBoard))
  //console.log(setMinesNegsCount(gBoard, 2, 2))


}



function onCellClicked(elCell, i, j) {

  const cell = gBoard[i][j]
  elSpanContent = elCell.querySelector(`span`)

  if (!gGame.isOn) return
  if (cell.isMarked) return
  if (cell.isShown) return

  if (!isTimeOn) {
    isTimeOn = true
    restartTimer()
  }

  if (isHintOn) {
    onShowAllNeg(gBoard, i, j)
    gUserHints--
    onRemoveHintCount(onBtnHintToRemove)

    return
  }

  if (cell.isMine) {
    if (isFirstClick) {
      cell.isMine = false
      drawnRandomMines(gBoard, 1)
      renderBoard(gBoard, '.board-container')
      gGame.shownCount = 0
      return
    }
    gUserLives--
    cell.isShown = true
    isFirstClick = false
    gGame.shownCount++
    console.log(gUserLives)
    onRemoveLiveCount()
    onSmileyBombAnimation()




  }

  if (!cell.isMine) {
    isFirstClick = false
    if (cell.minesAroundCount !== 0) elSpanContent.innerText = cell.minesAroundCount
    gGame.shownCount++
    expandShown(gBoard, elCell, i, j)
  }


  //console.log(elCell)

  elSpanContent.style.display = 'block'
  elCell.classList.add('marked-cell')
  cell.isShown = true
  checkGameOver()






}


function onRestartGame() {
  gGame.isOn = true
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.shownCount = 0
  gUserLives = 3
  gUserHints = 3
  gSafeClicks = 3

  isFirstClick = true
  stopTimer()
  isTimeOn = false
  var elGameOver = document.querySelector('.game-over')
  elGameOver.style.display = 'none'
  var elSpanSafeClick = document.querySelector('.safe-click-container .click-count')
  elSpanSafeClick.innerText = gSafeClicks
  const elLives = document.querySelector('.lives');
  const elHints = document.querySelectorAll('.hint');
  for (const hintSpan of elHints) {
    hintSpan.style.display = 'inline-block'
    hintSpan.style.backgroundColor = 'lightpink'
    hintSpan.innerText = '💡'

  }
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
  console.log('count:' + gGame.shownCount)
  console.log('marked' + gGame.markedCount)


  if (gUserLives === 3) {
    console.log('life:3')
    return (gLevel.MINES === gGame.markedCount && gGame.shownCount === ((gLevel.SIZE ** 2) - gLevel.MINES))
  }
  else if (gUserLives === 2) {
    console.log('life: 2')
    if (gLevel.MINES === (gGame.markedCount + 1) && gGame.shownCount === (gLevel.SIZE ** 2) - (gLevel.MINES - 1) || gLevel.MINES === (gGame.markedCount + 2) && gGame.shownCount === (gLevel.SIZE ** 2) - (gLevel.MINES - 2) || gGame.shownCount === (gLevel.SIZE ** 2)) {
      return true
    }
  } else {
    console.log('ddd')
    if (gLevel.MINES === (gGame.markedCount + 2) && gGame.shownCount === (gLevel.SIZE ** 2) - (gLevel.MINES - 2) || gLevel.MINES === (gGame.markedCount + 1) && gGame.shownCount === (gLevel.SIZE ** 2) - (gLevel.MINES - 1)) {
      return true
    }
  }
  return false
}

function checkGameOver() {
  if (gUserLives === 0) {
    gGame.isOn = false
    gameOverPopUp('You Lose')
    showAllMines()
    stopTimer()
    return
  }
  if ((checkWin())) {

    gGame.isOn = false
    console.log('dd')
    gameOverPopUp('You win')
    stopTimer()
    onUpdateWinTable()
    return
  }
}

function expandShown(board, elCell, i, j) {
  markNegcells(board, i, j);
}

// function markNegcells(board, rowIdx, colIdx) {
//   if (rowIdx < 0 || rowIdx >= board.length || colIdx < 0 || colIdx >= board[0].length) return
//   const currCell = board[rowIdx][colIdx]
//   if (currCell.isShown || currCell.isMine) return

//   currCell.isShown = true
//   gGame.shownCount++
//   console.log(gGame.shownCount)
//   const cell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
//   const cellContent = document.querySelector(`.cell-${rowIdx}-${colIdx} span`)
//   cell.classList.add('marked-cell')
//   cellContent.style.display = 'block'


//   if (currCell.minesAroundCount !== 0) return


//   for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//     for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//       if (i === rowIdx && j === colIdx) continue
//       markNegcells(board, i, j)
//     }
//   }
// }



function markNegcells(board, rowIdx, colIdx) {

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= board[0].length) continue
      var currCell = board[i][j]

      if (currCell.isMine || currCell.isMarked) continue

      var cell = document.querySelector(`.cell-${i}-${j}`)
      var cellContent = document.querySelector(`.cell-${i}-${j} span`)
      if (!currCell.isShown) gGame.shownCount++
      console.log(gGame.shownCount)
      currCell.isShown = true
      cell.classList.add('marked-cell')
      //if (currCell.minesAroundCount !== 0) {
      cellContent.style.display = 'block'
      //markNegcells(board, i, j)
    }
    //}
  }
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
      gLevel.SIZE = 4
      gLevel.MINES = 2
      gLevel.levelName = 'beginner'
      onRestartGame()
      break;
    case 'Intermediate':
      gLevel.SIZE = 8
      gLevel.MINES = 14
      gLevel.levelName = 'intermediate'
      onRestartGame()
      break;
    case 'Expert':
      gLevel.SIZE = 12
      gLevel.MINES = 32
      gLevel.levelName = 'expert'
      onRestartGame()
      break;
    case 'Custom':
      gLevel.levelName = 'custom'
      OnCustomButton()
      //onRestartGame()
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

function onRemoveHintCount(elBtn) {
  if (gUserHints === 0) {
    elBtn.innerText = 'NO MORE HINTS ❌'
    elBtn.style.backgroundColor = 'lightpink'
    //elBtn.style.display = 'block'
  } else {
    elBtn.style.display = 'none'
  }

  //elBtn.style.board = 'none'
}

function onPressHint(elBtn) {
  console.log(elBtn)
  onBtnHintToRemove = elBtn
  elBtn.style.backgroundColor = 'lightyellow'
  isHintOn = true
}

function onShowAllNeg(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue
      if (j < 0 || j >= board[0].length) continue
      var currCell = board[i][j]

      let cell = document.querySelector(`.cell-${i}-${j}`)
      let cellContent = document.querySelector(`.cell-${i}-${j} span`)

      if (!currCell.isShown) {

        cell.classList.add('hinted')
        cellContent.style.display = 'block'
        setTimeout(() => {
          cellContent.style.display = 'none'
          cell.classList.remove('hinted')
          console.log(cell)

        }, 2000)

      }
    }
  }
  isHintOn = false

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

function OnCustomButton() {
  if (!isCustomBtnSelected) {
    document.querySelector('.custom-pop').style.display = 'block'
    isCustomBtnSelected = true
  } else {
    isCustomBtnSelected = false
    document.querySelector('.custom-pop').style.display = 'none'
    // console.log(input)
  }
}

function submitButton() {
  const coloms = +document.querySelector('.coloms').value
  const height = +document.querySelector('.height').value
  const mines = +document.querySelector('.mines').value
  if (coloms < 0 || height < 0 || mines < 0 || coloms === '' || coloms < 4 || height < 4) return
  gLevel.SIZE = coloms
  gLevel.MINES = mines
  onRestartGame()
  document.querySelector('.custom-pop').style.display = 'none'


}

function onSafeClick() {
  if (gSafeClicks === 0) return

  gSafeClicks--
  var elSpanSafeClick = document.querySelector('.safe-click-container .click-count')
  elSpanSafeClick.innerText = gSafeClicks
  var safePos = findSafePos(gBoard)
  var cellContent = document.querySelector(`.cell-${safePos.i}-${safePos.j} span`)
  var cell = document.querySelector(`.cell-${safePos.i}-${safePos.j}`)

  cellContent.style.display = 'block'
  cell.style.backgroundColor = 'orange'
  setTimeout(() => {
    cellContent.style.display = 'none'
    cell.style.backgroundColor = 'lightpink'

  }, 2000)
}

function onRegister() {
  document.querySelector('.register-pop-up').style.display = 'block'

}

function confrimButton() {
  gCurrUsername = document.querySelector('.username').value
  document.querySelector('.register-pop-up').style.display = 'none'

}

function onUpdateWinTable() {
  switch (gLevel.levelName) {
    case 'expert':
      document.querySelector('.expert').innerText += `*${gCurrUsername}*  Time: ${gGame.secsPassed}\n`
      break;
    case 'intermediate':
      document.querySelector('.intermediate').innerText += `*${gCurrUsername}*  Time: ${gGame.secsPassed}\n`
      break;
    case 'beginner':
      document.querySelector('.beginner').innerText += `*${gCurrUsername}*  Time: ${gGame.secsPassed}\n`
      break;

    default:
      break;
  }
}

