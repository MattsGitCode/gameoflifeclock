/// <reference path="Font.ts" />
/// <reference path="GameOfLife.ts" />
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

        var stringWidth = Font.charSize.x * text.length + Font.charSpacing * (text.length - 1);

        var charX = Math.floor((this.resolution.x - stringWidth) / 2);
        var charY = Math.floor((this.resolution.y - Font.charSize.y) / 2);

        for (var charIndex = 0; charIndex < text.length; ++charIndex) {
            var char = Font.getChar(text[charIndex]);
            for (y = 0; y < char.length; ++y) {
                for (x = 0; x < char[y].length; ++x) {
                    cells[charY + y][charX + x] = char[y][x];
                }
            }

            charX += Font.charSize.x + Font.charSpacing;
        }

        this.game.setLivingCells(cells);
    };

    Display.prototype.start = function () {
        this.game.start(1000);
    };

    Display.prototype.stop = function () {
        this.game.stop();
    };
    return Display;
})();
//@ sourceMappingURL=Display.js.map
