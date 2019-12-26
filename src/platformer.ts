import { Point2d } from "./point2d";
import heroImg from './img/hero.png';

export class PlatformerGame {
    private canvas: HTMLCanvasElement;
    private keysDown: KeysDown;
    private hero: PlatformerHero;
    private then = Date.now();

    public run() {
        this.canvas = this.createCanvas();
        this.hero = new PlatformerHero();
        this.hero.loadAssets();
        this.keysDown = new KeysDown();

        addEventListener("keydown", (e: KeyboardEvent) => {
            this.handleKeyDown(e.keyCode);
        }, false);
    
        addEventListener("keyup", (e: KeyboardEvent) => {
            this.handleKeyUp(e.keyCode);
        }, false);

        this.gameLoop();
    }

    private gameLoop = () => {
        var now = Date.now();
        var elapsedMs = (now - this.then)/1000;

        this.udpate(elapsedMs);
        this.render();

        this.then = now;

        requestAnimationFrame(this.gameLoop);
    };

    private udpate(elapsedMs: number) {
        this.hero.update(this.keysDown, elapsedMs);
    }

    private render() {
        const ctx = this.canvas.getContext('2d');
        this.hero.draw(ctx);
    };

    private createCanvas(): HTMLCanvasElement {
        var canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        document.body.appendChild(canvas);
        return canvas;
    }

    private handleKeyDown(keyCode: number) {
        switch (keyCode) {
            case 38: this.keysDown.up    = true; break;
            case 40: this.keysDown.down  = true; break;
            case 37: this.keysDown.left  = true; break;
            case 39: this.keysDown.right = true; break;
        }
    };
    
    private handleKeyUp(keyCode: number) {
        switch (keyCode) {
            case 38: this.keysDown.up    = false; break;
            case 40: this.keysDown.down  = false; break;
            case 37: this.keysDown.left  = false; break;
            case 39: this.keysDown.right = false; break;
        }
    };
}

class KeysDown {
    up = false;
    down = false;
    left = false;
    right = false;
}

class PlatformerHero {
    public position = new Point2d(0, 0);

    private _speed = 256; //px/sec
    private _image: HTMLImageElement;
    private _assetsLoaded = false;

    constructor() {}

    public setPosition(position: Point2d) {
        this.position = position;
    }

    public update(keysDown: { up: boolean; down: boolean; left: boolean; right: boolean; }, elapsed: number) {
        if (keysDown.left)  { this.position.x -= this._speed * elapsed; }
        if (keysDown.right) { this.position.x += this._speed * elapsed; }
    }

    public loadAssets() {
        this._image = new Image();
        this._image.onload = () => {
            this._assetsLoaded = true;
        };
        this._image.src = heroImg;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (this._assetsLoaded) {
            ctx.drawImage(this._image, this.position.x, this.position.y);
        }
    }

    private fall() {
        if (this.position.y > 450) {
            this.position.y -= 2;
        }
    }
}
