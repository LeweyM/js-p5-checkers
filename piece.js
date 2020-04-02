const ANIMATIONDURATION = 20;

class Piece {
    color;
    rank;
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
        this.rank = PAWN;
        this.squareSize = squareSize;
        this.onTransitionFinished = onTransitionFinished;
        this.animationFrame = ANIMATIONDURATION;
        this.isAnimating = false;
    }

    move(tx, ty) {
        this.setTranslationCoordinates(tx, ty);
        this.startAnimation();
    };

    promote() {
        this.rank = KING;
        this.onTransitionFinished();
    }

    draw() {
        if (this.isAnimating) {
            this.drawChecker(this.translatedX(), this.translatedY());
            this.tick();
        } else {
            this.drawChecker(this.x, this.y);
        }
    };

    //private methods

    translatedX = () => this.prevX + ((this.x - this.prevX) / ANIMATIONDURATION) * this.animationFrame;
    translatedY = () => this.prevY + ((this.y - this.prevY) / ANIMATIONDURATION) * this.animationFrame;

    tick() {
        this.animationFrame++;
        if (this.animationFrame > ANIMATIONDURATION) {
            this.isAnimating = false;
            this.onTransitionFinished();
        }
    }

    setTranslationCoordinates(tx, ty) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = tx;
        this.y = ty;
    }

    startAnimation() {
        this.animationFrame = 0;
        this.isAnimating = true;
    }
    drawChecker(x, y) {
        this.fillChecker();
        if (this.rank === PAWN) {
            this.drawPawn(x, y);
        } else if (this.rank === KING) {
            this.drawKing(x, y)
        }
    }

    fillChecker() {
        if (this.color === BLUE) {
            fill(0, 0, 255);
        } else if (this.color === RED) {
            fill(255, 0, 0);
        }
    }

    drawPawn(x, y) {
        const halfSquare = this.squareSize / 2;
        ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.7);
        noFill();
        ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.5);
    }

    drawKing(x, y) {
        const halfSquare = this.squareSize / 2;
        ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.8);
        noFill();
        ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.6);
        ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.5);
    }
}