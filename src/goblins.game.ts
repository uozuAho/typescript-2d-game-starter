import backgroundImg from './background.png';

export function runGoblinsGame() {
    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
    document.body.appendChild(canvas);

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
        ctx.drawImage(bgImage, 0, 0);
    };
    bgImage.src = backgroundImg;

    ctx.rect(50, 50, 50 , 50);
    ctx.stroke();
}
