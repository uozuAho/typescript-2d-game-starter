import backgroundImg from './img/background.png';
import monsterImg from './img/monster.png';
import { Hero } from './hero';
import { Point2d } from './point2d';

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

    const hero = new Hero();
    hero.loadAssets();

    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    monsterImage.src = monsterImg;

    // Game objects
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
        hero.setPosition(new Point2d(canvas.width / 2, canvas.height / 2));

        // Throw the monster somewhere on the screen randomly
        monster.x = 32 + (Math.random() * (canvas.width - 64));
        monster.y = 32 + (Math.random() * (canvas.height - 64));
    };

    // Update game objects
    var update = function (elapsed: number) {
        hero.update(keysDown, elapsed);

        // Are they touching?
        if (
            hero.position.x <= (monster.x + 32)
            && monster.x <= (hero.position.x + 32)
            && hero.position.y <= (monster.y + 32)
            && monster.y <= (hero.position.y + 32)
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

        hero.draw(ctx);

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
