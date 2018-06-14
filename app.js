// randomly chooses color that starts game
let player = Math.random() > 0.5 ? 'red' : 'yellow';
let gameOver = false;
let empties = 42;

// mouseenter event listener on columns with at least 1 empty cell
$('.col.empty').on('mouseenter', function(){
  if(!gameOver) {
    const col = $(this).data('col');
    const topRow = 1;
    const lastEmpty = findLastEmptyCell(col);
    if(lastEmpty) {
      // creates the coin cursor at the top of the column
      $(`.col[data-col='${col}'][data-row=${topRow}]`).prepend(`<div id="top" class="${player} top"></div>`);
      // creates the coin cursor in the cell where it will be placed if clicked
      lastEmpty.addClass(`${player}-target`);
    }
  }
})
// allows players to restart when game is over
$(document).on('keydown', (event) => {
  if(event.which===32 && gameOver) {
    location.reload();
  }
})

// click event for when user chooses to drop coin
$('.col.empty').click(function() {
  if(!gameOver) {
    // removes the coin cursor at the top
    $('#top').remove();
    const col = $(this).data('col');
    const row = $(this).data('row');
    const lastEmpty = findLastEmptyCell(col);
    // creates custom data attribute to track colors in selected cells
    lastEmpty.attr('data-player', player);
    lastEmpty.removeClass(`${player}-target`);
    lastEmpty.removeClass('empty');
    lastEmpty.addClass(player);
    // decrement global var empties to track if game will end in tie when 0 cells left
    empties--;
    // checks for winner by calling checkForWinner function with data for
    // row and col of coin that was just dropped
    const winner = checkForWinner(lastEmpty.data('row'),lastEmpty.data('col'));

    if(winner) {
      console.log($(`.col[data-player='${player}']`))
      $('#result').append(`<h2><span style='color: ${player}'>${player.toUpperCase()}</span> has won! Press Space to play again.</h2>`)
      gameOver = true;
    } else if(empties===0) {
      $('#result').append(`<h2>Tie Game. Press Space to Play Again!</h2>`)
      gameOver = true;
    }
    // changes the color of the coin, switching whose turn it is
    player = (player==='red') ? 'yellow' : 'red';
    // this re-triggers the mouseenter event to immediately place the new
    // target directly above the slot that was just selected
    // otherwise you would need to move cursor to new cell to reset cursor
    $(this).trigger('mouseenter');
  } else {
    alert('Game is over. Press space to play again')
  }
})

// removes the coin cursors as user switches between columns
$('.col').on('mouseleave', () => {
  $('#top').remove();
  $('.col').removeClass(`${player}-target`);
})

// finds the open cell at bottom of column where coin will be dropped
function findLastEmptyCell(col) {
  const cells = $(`.col[data-col='${col}']`);
  for (let i=cells.length-1; i>=0; i--) {
    const cell = $(cells[i]);
    if(cell.hasClass('empty')) {
      return cell;
    }
  }
  return null;
}


function checkForWinner(row,col) {

  // method for getting/checking cell
  // needed for checkDir to check neighboring cells
  function getCell(i,j) {
    return $(`.col[data-row='${i}'][data-col=${j}]`);
  }

  function checkDir(direction) {
    let total = 0;
    // row and col are passed in here to set starting point
    // i & j are used to help move next cell to check neighbor cell
    let i = row + direction.i;
    let j = col + direction.j;
    let next = getCell(i,j);
    // while neighbor cell is within board and contains same data-player attribute
    // increment total, then increment i & j to continue check in that direction
    while (i>=1 && i<=6 && j>=1 && j<=7 && next.attr('data-player')===player) {
      total++;
      i+=direction.i;
      j+=direction.j;
      next = getCell(i,j);
    }
    return total;
  }

  function checkWin(directionA,directionB) {
    // checking total # of pieces with matching data-player attribute in each direction
    // starts with 1 for piece that was just placed
    const total = 1 + checkDir(directionA) + checkDir(directionB);
    // if 4 in a row, return player (current color, which is the winner)
    return total>=4 ? player: null;
  }

  function checkVertical() {
    // objects are passed in with i and j properties to be passed along to checkDir
    // first obj checks going up by decrementing row
    // second obj checks going down by incrementing row
    return checkWin({i:-1,j:0}, {i:1, j:0});
  }

  function checkHorizontal() {
    // first obj checks going left by decrementing col
    // second obj checks going right by incrementing col
    return checkWin({i:0,j:-1}, {i:0, j:1});
  }

  function checkDiagonalTLtoBR() {
    // first obj checks down and to the right
    // second obj checks up and to the left
    // checks diagonal direction from top left to bottom right
    return checkWin({i:1,j:1}, {i:-1,j:-1});
  }

  function checkDiagonalBLtoTR() {
    // first obj checks down and to the left
    // second obj checks up and to the right
    // checks diagonal direction from bottom left to top right
    return checkWin({i:1,j:-1}, {i:-1,j:1});
  }

  // calls each function to check all directions
  // if any return true, then there is a winner, and it will return the winner
  return checkVertical() || checkHorizontal() || checkDiagonalTLtoBR() || checkDiagonalBLtoTR();
}
