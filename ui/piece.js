import {PAWN, BLUE, KING, RED} from "../gameEngine/checkers.js";

export default class Piece {
    color;
    rank;
    x;
    y;
    animationFrame;
    isAnimating;
    prevX;
    prevY;
    squareSize;
    s;
    onTransitionFinished;

    constructor(s, x, y, color, squareSize, onTransitionFinished) {
        this.s = s;
        this.x = x;
        this.y = y;
        this.color = color;
        this.rank = PAWN;
        this.squareSize = squareSize;
        this.onTransitionFinished = onTransitionFinished;
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

    draw(ms) {
        if (this.isAnimating) {
            this.tick(ms);
            this.drawChecker(this.translatedX(ms), this.translatedY(ms));
        } else {
            this.drawChecker(this.x, this.y);
        }
    };

    //private methods

    translatedX = (duration) => this.prevX + ((this.x - this.prevX) / duration) * this.animationFrame;
    translatedY = (duration) => this.prevY + ((this.y - this.prevY) / duration) * this.animationFrame;

    tick(duration) {
        this.animationFrame++;
        if (this.animationFrame > duration) {
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
            this.s.fill(50, 50, 255);
        } else if (this.color === RED) {
            this.s.fill(255, 0, 0);
        }
    }

    drawPawn(x, y) {
        const halfSquare = this.squareSize / 2;
        this.s.strokeWeight(1);
        this.s.ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.7);
        this.s.noFill();
        this.s.ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.5);
    }

    drawKing(x, y) {
        const halfSquare = this.squareSize / 2;
        this.s.strokeWeight(2);
        this.s.ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.8);
        this.s.noFill();
        this.s.ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.6);
        this.s.ellipse(x * this.squareSize + halfSquare, y * this.squareSize + halfSquare, this.squareSize * 0.4);
    }
}