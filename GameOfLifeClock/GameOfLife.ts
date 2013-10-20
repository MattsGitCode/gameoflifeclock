interface ISize { x: number; y: number; }
interface IPoint { x: number; y: number; }

class GameOfLife {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cellSpacing: number;
    cellRadius: number;

    resolution: ISize;
    timer: number;
    cells: number[][];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.cellSpacing = 1;
        this.cellRadius = 2;
    }

    public setLivingCells(cells: number[][]): void {
        this.cells = cells;
        this.render();
    }

    public getResolution(): ISize {
        var cellSize = this.cellRadius * 2 + this.cellSpacing;
        return {
            x: Math.floor((this.canvas.width + this.cellSpacing) / cellSize),
            y: Math.floor((this.canvas.height + this.cellSpacing) / cellSize),
        };
    }

    public start(interval: number): void {
        this.stop();
        this.timer = setInterval(() => this.step(), interval);
    }

    public stop(): void {
        clearInterval(this.timer);
    }

    private step(): void {
        this.cells = GameOfLife.getNextSteps(this.cells);
        this.render();
    }

    private render(): void {
        var y: number,
            x: number;

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
    }

    private getCellCentre(x: number, y: number): IPoint {
        return {
            x: this.cellRadius + (2 * x * this.cellRadius) + ((x - 1) * this.cellSpacing),
            y: this.cellRadius + (2 * y * this.cellRadius) + ((y - 1) * this.cellSpacing),
        };
    }

    static getNextSteps(oldCells: number[][]): number[][] {
        var newCells: number[][] = [],
            x: number,
            y: number,
            oldRow: number[],
            newRow: number[],
            neighbourCount: number;

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
    }

    static countNeighbours(cells: number[][], x: number, y: number): number {
        var count: number = 0,
            r0: number[] = cells[y - 1],
            r1: number[] = cells[y],
            r2: number[] = cells[y + 1];

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
    }

    static getNextCellState(oldState: number, neighbourCount: number): number {
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
    }
}