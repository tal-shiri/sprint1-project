'use strict'
function createBoard(rows, coloms) {
    var board = []

    for (var i = 0; i < rows; i++) {
        board[i] = []

        for (var j = 0; j < coloms; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }


    }


    console.log(board)
    updateBoard(board)

    // board[3][3].isMine = true
    // board[2][1].isMine = true
    // board[1][1].isMine = true

    // board[1][2].isMine = true

    return board
}

function updateBoard(board) {
    drawnRandomMines(board, gLevel.MINES)
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j];
            cell.minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
}



function renderBoard(board, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            const cellContent = (cell.isMine) ? MINE : ''
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,event,${i},${j})" ><span style="display: none;">${cellContent}</span></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count

}
// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value

    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function drawnRandomMines(board, numberRounded) {
    for (let i = 0; i < numberRounded; i++) {
        var randomPos = findEmptyPos(board)
        board[randomPos.i][randomPos.j].isMine = true
    }
}



function findEmptyPos(gBoard) {
    var emptyPoss = [] // [{i:0,j:0} , {i:0,j:1}]

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 1; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            // console.log('cell:', cell) // ''

            if (!cell.isMine) {
                var pos = { i: i, j: j }
                emptyPoss.push(pos)
                console.log()
            }
        }
    }

    if (!emptyPoss.length) {
        console.log('sss')
        return
    }


    // console.log('emptyPoss:', emptyPoss)
    var randIdx = getRandomIntInclusive(0, emptyPoss.length - 1)
    var emptyPos = emptyPoss[randIdx]

    return emptyPos
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
