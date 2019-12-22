import backgroundImg from './img/background.png';
import heroImg from './img/hero.png';
import monsterImg from './img/monster.png';

class Point2d {
    constructor(public x: number, public y: number) {}
}

class Hero {
    public position = new Point2d(0, 0);

    private _speed = 256; //px/sec
    private _image: HTMLImageElement;
    private _assetsLoaded = false;

    constructor() {}

    public setPosition(position: Point2d) {
        this.position = position;
    }

    update(keysDown: { up: boolean; down: boolean; left: boolean; right: boolean; }, elapsed: number) {
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

export function runGoblinsGame() {
    const keysDown = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
    document.body.appendChild(canvas);

    // load images
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = backgroundImg;

    const hero2 = new Hero();
    hero2.loadAssets();

    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    heroImage.src = heroImg;

    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    monsterImage.src = monsterImg;

    // Game objects
    var hero = {
        speed: 256, // movement in pixels per second
        x: 0,
        y: 0
    };
    var monster = {
        x: 0,
        y: 0
    };
    var monstersCaught = 0;

    addEventListener("keydown", function (e) {
        handleKeyDown(e.keyCode);
    }, false);

    addEventListener("keyup", function (e) {
        handleKeyUp(e.keyCode);
    }, false);

    function handleKeyDown(keyCode: number) {
        switch (keyCode) {
            case 38: keysDown.up    = true; break;
            case 40: keysDown.down  = true; break;
            case 37: keysDown.left  = true; break;
            case 39: keysDown.right = true; break;
        }
    };
    
    function handleKeyUp(keyCode: number) {
        switch (keyCode) {
            case 38: keysDown.up    = false; break;
            case 40: keysDown.down  = false; break;
            case 37: keysDown.left  = false; break;
            case 39: keysDown.right = false; break;
        }
    };

    // Reset the game when the player catches a monster
    var reset = function () {
        hero2.setPosition(new Point2d(canvas.width / 2, canvas.height / 2));
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;

        // Throw the monster somewhere on the screen randomly
        monster.x = 32 + (Math.random() * (canvas.width - 64));
        monster.y = 32 + (Math.random() * (canvas.height - 64));
    };

    // Update game objects
    var update = function (elapsed: number) {
        hero2.update(keysDown, elapsed);

        // Are they touching?
        if (
            hero2.position.x <= (monster.x + 32)
            && monster.x <= (hero2.position.x + 32)
            && hero2.position.y <= (monster.y + 32)
            && monster.y <= (hero2.position.y + 32)
        ) {
            ++monstersCaught;
            reset();
        }
    };

    // Draw everything
    var render = function () {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }

        hero2.draw(ctx);

        if (monsterReady) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
        }

        // Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
    };

    let then = Date.now();

    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    main();
}
