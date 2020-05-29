var grid = 64;
var margin = Math.floor(grid / 16);
var size = 6;

//set up the canvas
var stage = document.getElementById("gameCanvas");
stage.width = (grid + margin) * size + margin;
stage.height = (grid + margin) * size + margin;
var ctx = stage.getContext("2d");

var black = 'rgb(0 0 0)';
var	grey = 'rgb(128 128 128)';
var	white = 'rgb(255 255 255)';
var	red = 'rgb(255 0 0)';
var	green = 'rgb(0 255 0)';
var	blue = 'rgb(0 0 255)';
var	yellow = 'rgb(255 255 0)';
var	lblue = 'rgb(0 255 255)';
var	magenta = 'rgb(255 0 255)';

var clickX = -1;
var clickY = -1;
var counters = 0;
var tiles = [];
var cut = false;
var won = false;
var solution = [];
var solutions = [];
var duplicate = false;

function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function illegal() {
  for (let tile of tiles) {
    if (tile.color == red) {
      tile.color = white;
    }
  }
  counters = 0;
  for (let tile of tiles) {
    if (tile.color == green) {
      counters++;
    }
  }
  if (counters > 1) {
    for (let tile0 of tiles) {
      if (tile0.color != green) {
        for (let tile1 of tiles) {
          if (tile1.color == green) {
            for (let tile2 of tiles) {
              if (tile2.color == green) {
                if (tile1 != tile2 && distance(tile0, tile1) == distance(tile0, tile2)) {
                  tile0.color = red;
                }
                for (let tile3 of tiles) {
                  if (tile3.color == green && distance(tile2, tile3) == distance(tile1, tile0)) {
                    tile0.color = red;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

function solve() {
  let layers = 1;
  for (let tile of tiles) {
    if (tile.color == white) {
      tile.color = green;
      illegal();
      requestAnimationFrame(render);
      //alert();
      layers++;
      solve();
      if (counters == size) {
        /*solution = [];
        for (let tile of tiles) {
          if (tile.color == green) {
            solution[solution.length] = [tile.x, tile.y];
          }
        }
        
        if (solutions.length > 0) {
          duplicate = true;
          for (i = 0; i < solutions.length; i++) {
            for (j = 0; j < solutions[i].length; j++) {
              if (solution[j][0] != solutions[i][j][0] || solution[j][1] != solutions[i][j][1]) {
                duplicate = false;
              }
            }
          }
          if (duplicate == false) {
            solutions[solutions.length] = solution;
            solution = [];
          }
        } else if (solutions.length == 0) {
          solutions[solutions.length] = solution;
          solution = [];
        }
        if (solutions.length >= 2) {
          alert(solutions);
          return;
        }*/
        return;
      }
      tile.color = white;
      illegal();
      requestAnimationFrame(render);
    }
  }
}

function setup() {
  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      tiles[tiles.length] = {x: i, y: j, color: white};
    }
  }
}

function update() {
//Math.floor((clickX - margin)/(grid + margin)) is the scaled x-coord of the mouse
  illegal();
  for (let tile of tiles) {
    if (tile.color == green && tile.x == Math.floor((clickX - margin)/(grid + margin)) && tile.y == Math.floor((clickY - margin)/(grid + margin))) {
      tile.color = white;
      clickX = -1;
      clickY = -1;
    }
  }
  for (let tile of tiles) {
    if (tile.color == white && tile.x == Math.floor((clickX - margin)/(grid + margin)) && tile.y == Math.floor((clickY - margin)/(grid + margin))) {
      tile.color = green;
      clickX = -1;
      clickY = -1;
    }
  }
}

function render() {
  ctx.fillStyle = black;
  ctx.fillRect(0, 0, stage.width, stage.height);
  for (let tile of tiles) {
    ctx.fillStyle = tile.color;
    ctx.fillRect(tile.x * (grid + margin) + margin, tile.y * (grid + margin) + margin, grid, grid);
  }
}

function main() {
  update();
  render();
  requestAnimationFrame(main);
  counters = 0;
  for (let tile of tiles) {
    if (tile.color == green) {
      counters++;
    }
  }
  if (counters == size && won == false) {
    won = true;
    alert('YOU WON!');
  } else if (counters != size) {
    won = false;
  }
}

var canvasClick = function (event) {
  clickX = event.clientX - stage.offsetLeft + document.body.scrollLeft;
	clickY = event.clientY - stage.offsetTop + document.body.scrollTop;
}

addEventListener("click", canvasClick, false);

setup();
solve();
main();
