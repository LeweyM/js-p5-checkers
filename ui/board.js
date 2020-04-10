import Piece from "./piece.js";
import {winnerCounter, ANIMATION_DURATION} from "./sketch.js";
import {RED} from "../gameEngine/checkers.js";

export default class Board {
    game;
    pieces;
    size;
    squareSize;
    s;
    selected;
    possibleMoves;
    animationQueue;
    humanPlayer;

    constructor(s, size, game) {
        this.s = s;
        this.game = game;
        this.size = size;
        this.squareSize = size / 8;
        this.selected = null;
        this.possibleMoves = [];
        this.animationQueue = [];
        this.humanPlayer = null;
        this.start();
    }

    start() {
        this.pieces = this.game.getInitialPositions()
            .map(c => new Piece(this.s, c.x, c.y, c.value, this.squareSize, () => this.startNextTransition()));
        const initialMoves = this.game.startGame();
        this.addMovesToQueue(initialMoves);
    }

    click(xPos, yPos) {
        if (this.game.isWinner() === null) {
            this.action(this.xFromMouse(xPos), this.yFromMouse(yPos));
        }
    }

    action(x, y) {
        if (this.isValidMove(x, y)) {
            this.addMovesToQueue(this.game.makeMove(this.getMove(x, y), this.humanPlayer));
            this.unselectCell();
        } else if (this.isPlayerPiece(x, y)) {
            this.selectCell(x, y)
        } else {
            this.unselectCell();
        }
    }

    //private methods

    isValidMove(x, y) {
        return this.selected && this.possibleMoves.some(m => {
            return m.target.x === x
                && m.target.y === y
                && m.source.x === this.selected.x
                && m.source.y === this.selected.y
        });
    }

    getMove(x, y) {
        return this.possibleMoves.find(m => m.target.x === x && m.target.y === y);
    }

    isPlayerPiece(x, y) {
        const piece = this.getPiece(x, y);
        return piece && piece.color === this.humanPlayer;
    }

    getPiece(x, y) {
        return this.pieces.find(p => p.x === x && p.y === y)
    }

    isSelected(x, y) {
        return this.selected && x === this.selected.x && y === this.selected.y;
    }

    selectCell(x, y) {
        if (this.isPlayerPiece(x, y)) {
            this.selected = {x: x, y: y};
            this.possibleMoves = this.game.getPossibleMoves(x,y, this.humanPlayer);
        }
    }

    unselectCell() {
        this.selected = null;
        this.possibleMoves = [];
    }

    addMovesToQueue(moves) {
        for (let move of moves) this.animationQueue.push(move);
        this.startNextTransition();
    }

    draw() {
        this.drawBoard();
        this.pieces.forEach(piece => piece.draw(ANIMATION_DURATION));
    }

    drawBoard() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.isSelected(x, y)) {
                    this.s.fill(100, 100, 0)
                } else if (this.possibleMoves.find(m => m.target.x === x && m.target.y === y)) {
                    this.s.fill(200, 0, 0);
                } else if ((x + y) % 2) {
                    this.s.fill(255 - (x*20), 255 - (y*20), 255 - ((y+x)*20));
                } else {
                    this.s.fill(20);
                }
                this.s.rect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            }
        }
    }

    startNextTransition() {
        const nextEvent = this.animationQueue.shift();
        console.log(nextEvent);
        if (!nextEvent) return null;

        if (nextEvent.type === "GAME_OVER") {
            winnerCounter[nextEvent.winner] += 1;
            this.start()
        } else {
            this.movePiece(nextEvent);
        }
    }

    movePiece(nextMove) {
        const piece = nextMove.source && this.getPiece(nextMove.source.x, nextMove.source.y);
        if (nextMove.type === "PROMOTE") {
            piece.promote();
            return;
        }
        piece.move(nextMove.target.x, nextMove.target.y);
        if (nextMove.type === "JUMP") {
            this.removePiece(nextMove.middle.x, nextMove.middle.y);
        }
    }

    removePiece(x, y) {
        const victimIndex = this.pieces.findIndex(p => x === p.x && y === p.y);
        this.pieces.splice(victimIndex, 1)
    }

    yFromMouse(yPos) {
        return Math.floor(yPos / this.squareSize);
    }

    xFromMouse(xPos) {
        return Math.floor(xPos / this.squareSize);
    }
}