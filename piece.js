const ANIMATIONDURATION = 20;

class Piece {
    color;
    x;
    y;
    animationFrame;
    isAnimating;
    prevX;
    prevY;
    squareSize;
    onTransitionFinished;

    constructor(x, y, color, squareSize, onTransitionFinished) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.squareSize = squareSize;
        this.onTransitionFinished = onTransitionFinished;
        this.animationFrame = ANIMATIONDURATION;
        this.isAnimating = false;
    }

    move(tx, ty) {
        this.animationFrame = 0;
        this.isAnimating = true;

        this.prevX = this.x;
        this.prevY = this.y;

        this.x = tx;
        this.y = ty;
    };

    draw() {
        if (this.isAnimating) {
            this.animationFrame++;

            const stepX = ((this.x - this.prevX) / ANIMATIONDURATION) * this.animationFrame;
            const stepY = ((this.y - this.prevY) / ANIMATIONDURATION) * this.animationFrame;

            this.drawChecker(this.prevX + stepX, this.prevY + stepY, this.squareSize);

            if (this.animationFrame >= ANIMATIONDURATION) {
                this.isAnimating = false;
                this.onTransitionFinished();
            }
        } else {
            this.drawChecker(this.x, this.y, this.squareSize);
        }
    };

    //private methods

    drawChecker(x, y, squareSize) {
        const halfSquare = squareSize / 2;

        if (this.color === BLUE) {
            fill(0, 0, 255);
        } else if (this.color === RED) {
            fill(255, 0, 0);
        }
        ellipse(x * squareSize + halfSquare, y * squareSize + halfSquare, squareSize * 0.7);
        noFill();
        ellipse(x * squareSize + halfSquare, y * squareSize + halfSquare, squareSize * 0.5)
    }

}