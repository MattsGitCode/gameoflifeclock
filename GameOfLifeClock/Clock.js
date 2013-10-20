/// <reference path="Display.ts" />
var Clock = (function () {
    function Clock(canvas) {
        this.display = new Display(canvas);
    }
    Clock.prototype.setTime = function (time) {
        this.display.stop();
        var hours = time.getHours(), minutes = time.getMinutes(), text = '' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        this.display.setText(text);
        this.display.start();
    };

    Clock.prototype.start = function () {
        var _this = this;
        this.stop();
        this.timerToken = setInterval(function () {
            return _this.setTime(new Date());
        }, 60000);
        this.setTime(new Date());
    };

    Clock.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Clock;
})();

window.onload = function () {
    var el = document.getElementById('clock');
    var clock = new Clock(el);
    clock.start();
};
//@ sourceMappingURL=Clock.js.map
