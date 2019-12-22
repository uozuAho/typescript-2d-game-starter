import heroImg from './img/hero.png';
import { Point2d } from './point2d';

export class Hero {
    public position = new Point2d(0, 0);

    private _speed = 256; //px/sec
    private _image: HTMLImageElement;
    private _assetsLoaded = false;

    constructor() {}

    public setPosition(position: Point2d) {
        this.position = position;
    }

    public update(keysDown: { up: boolean; down: boolean; left: boolean; right: boolean; }, elapsed: number) {
        if (keysDown.up)    { this.position.y -= this._speed * elapsed; }
        if (keysDown.down)  { this.position.y += this._speed * elapsed; }
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
}
