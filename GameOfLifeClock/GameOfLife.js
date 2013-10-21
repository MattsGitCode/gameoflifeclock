var GameOfLife = (function () {
    function GameOfLife(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.cellSpacing = 1;
        this.cellRadius = 2;
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

    GameOfLife.prototype.start = function (interval) {
        var _this = this;
        this.stop();
        this.timer = setInterval(function () {
            return _this.step();
        }, interval);
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
            x: this.cellRadius + (2 * x * this.cellRadius) + (x * this.cellSpacing),
            y: this.cellRadius + (2 * y * this.cellRadius) + (y * this.cellSpacing)
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
//@ sourceMappingURL=GameOfLife.js.map
