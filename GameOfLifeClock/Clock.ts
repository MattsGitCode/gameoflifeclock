/// <reference path="Display.ts" />

class Clock {
    display: Display;
    timerToken: number;


    constructor(canvas: HTMLCanvasElement) {
        this.display = new Display(canvas);
    }

    public setTime(time: Date): void {
        this.display.stop();
        var hours = time.getHours(),
            minutes = time.getMinutes(),
            text = '' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        this.display.setText(text);
        this.display.start();
    }

    start() {
        this.stop();
        this.timerToken = setInterval(() => this.setTime(new Date()), 60000);
        this.setTime(new Date());
    }

    stop() {
        clearTimeout(this.timerToken);
    }
}

window.onload = () => {
    var el = <HTMLCanvasElement>document.getElementById('clock');
    var clock = new Clock(el);
    clock.start();
};