var GameOfLife = (function () {
    function GameOfLife(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.cellSpacing = 2;
        this.cellRadius = 5;
    }
    GameOfLife.prototype.setLivingCells = function (cells) {
        this.cells = cells;
        this.render();
    };

    GameOfLife.prototype.getResolution = function () {
        var cellSize = this.cellRadius * 2 + this.cellSpacing;
        return {
            x: Math.floor((this.canvas.width + this.cellSpacing) / cellSize),
            y: Math.floor((this.canvas.height + this.cellSpacing) / cellSize)
        };
    };

    GameOfLife.prototype.start = function () {
        var _this = this;
        this.timer = setInterval(function () {
            return _this.step();
        }, 100);
    };

    GameOfLife.prototype.stop = function () {
        clearInterval(this.timer);
    };

    GameOfLife.prototype.step = function () {
        this.cells = GameOfLife.getNextSteps(this.cells);
        this.render();
    };

    GameOfLife.prototype.render = function () {
        var y, x;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (y = 0; y < this.cells.length; ++y) {
            var row = this.cells[y];
            for (x = 0; x < row.length; ++x) {
                var cell = row[x];
                var point = this.getCellCentre(x, y);

                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, this.cellRadius, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = cell ? 'green' : '#EEEEEE';
                this.ctx.fill();
            }
        }
    };

    GameOfLife.prototype.getCellCentre = function (x, y) {
        return {
            x: this.cellRadius + (2 * x * this.cellRadius) + ((x - 1) * this.cellSpacing),
            y: this.cellRadius + (2 * y * this.cellRadius) + ((y - 1) * this.cellSpacing)
        };
    };

    GameOfLife.getNextSteps = function (oldCells) {
        var newCells = [], x, y, oldRow, newRow, neighbourCount;

        for (y = 0; y < oldCells.length; ++y) {
            oldRow = oldCells[y];
            newRow = [];
            newCells[y] = newRow;
            for (x = 0; x < oldRow.length; ++x) {
                neighbourCount = GameOfLife.countNeighbours(oldCells, x, y);
                newRow[x] = GameOfLife.getNextCellState(oldRow[x], neighbourCount);
            }
        }

        return newCells;
    };

    GameOfLife.countNeighbours = function (cells, x, y) {
        var count = 0, r0 = cells[y - 1], r1 = cells[y], r2 = cells[y + 1];

        if (r0) {
            count += (r0[x - 1] || 0);
            count += (r0[x] || 0);
            count += (r0[x + 1] || 0);
        }

        count += (cells[y][x - 1] || 0);
        count += (cells[y][x + 1] || 0);

        if (r2) {
            count += (r2[x - 1] || 0);
            count += (r2[x] || 0);
            count += (r2[x + 1] || 0);
        }

        return count;
    };

    GameOfLife.getNextCellState = function (oldState, neighbourCount) {
        if (oldState === 1) {
            if (neighbourCount < 2 || neighbourCount > 3) {
                return 0;
            } else {
                return 1;
            }
        } else {
            if (neighbourCount === 3) {
                return 1;
            } else {
                return 0;
            }
        }
    };
    return GameOfLife;
})();

var Display = (function () {
    function Display(canvas) {
        this.game = new GameOfLife(canvas);
        this.resolution = this.game.getResolution();
    }
    Display.prototype.setText = function (text) {
        var cells = [], x, y;

        for (y = 0; y < this.resolution.y; ++y) {
            cells[y] = [];
            for (x = 0; x < this.resolution.x; ++x) {
                cells[y][x] = 0;
            }
        }

        var stringWidth = Display.charSize.x * text.length + Display.charSpacing * (text.length - 1);

        var charX = Math.floor((this.resolution.x - stringWidth) / 2);
        var charY = Math.floor((this.resolution.y - Display.charSize.y) / 2);

        for (var charIndex = 0; charIndex < text.length; ++charIndex) {
            var char = Display.characters[text[charIndex]];
            for (y = 0; y < char.length; ++y) {
                for (x = 0; x < char[y].length; ++x) {
                    cells[charY + y][charX + x] = char[y][x];
                }
            }

            charX += Display.charSize.x + Display.charSpacing;
        }

        this.game.setLivingCells(cells);
    };

    Display.prototype.start = function () {
        this.game.start();
    };

    Display.charSize = { x: 5, y: 7 };
    Display.charSpacing = 2;
    Display.characters = {
        '0': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '1': [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [1, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [1, 1, 1, 1, 1]
        ],
        '2': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 1, 1, 0],
            [0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1]
        ],
        '3': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '4': [
            [0, 0, 0, 1, 0],
            [0, 0, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0]
        ],
        '5': [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '6': [
            [0, 0, 1, 1, 0],
            [0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '7': [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0]
        ],
        '8': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0]
        ],
        '9': [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 0, 0]
        ],
        ':': [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0]
        ],
        ' ': [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    };
    return Display;
})();

var Clock = (function () {
    function Clock(canvas) {
        this.display = new Display(canvas);
    }
    Clock.prototype.setTime = function (time) {
    };

    Clock.prototype.start = function () {
    };

    Clock.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Clock;
})();

window.onload = function () {
    var el = document.getElementById('clock');
    var display = new Display(el);

    display.setText('22:02');
    setTimeout(function () {
        display.start();
    }, 500);
};
//@ sourceMappingURL=app.js.map
