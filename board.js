const EMPTY = "EMPTY";
const BLUE = "BLUE";
const RED = "RED";

class Board {
    game;
    pieces;
    size;
    squareSize;
    selected;
    possibleMoves;
    moveQueue;

    constructor(size, game) {
        this.game = game;
        this.size = size;
        this.squareSize = size / 8;
        this.selected = null;
        this.possibleMoves = [];
        this.moveQueue = [];
        this.pieces = this.game.getSetupPieces()
            .map(c => new Piece(c.x, c.y, c.value, this.squareSize, () => this.startNextTransition()))
    }

    click(xPos, yPos) {
        const x = this.xFromMouse(xPos);
        const y = this.yFromMouse(yPos);

        if (this.isPossibleMove(indexToX(this.selected), indexToY(this.selected), x, y)) {
            let move = this.possibleMoves.find(m => m.target.x === x && m.target.y === y);
            this.addMovesToQueue(this.game.makeMove(move));
            this.startNextTransition();
            this.unselectCell();
        } else if (this.isPlayerPiece(x, y)) {
            this.selectCell(x, y)
        } else {
            this.unselectCell();
        }
    }

    unselectCell() {
        this.selected = null;
        this.possibleMoves = [];
    }

    yFromMouse(yPos) {
        return Math.floor(yPos / this.squareSize);
    }

    xFromMouse(xPos) {
        return Math.floor(xPos / this.squareSize);
    }

    isPlayerPiece(x, y) {
        const piece = this.getPiece(x, y);
        return piece && piece.color === BLUE
    }

    selectCell(x, y) {
        if (this.isPlayerPiece(x, y)) {
            this.selected = coordsToIndex(x, y);
            this.possibleMoves = this.game.getPossibleMoves(x,y);
        }
    }

    isPossibleMove(x, y, tx, ty) {
        return this.possibleMoves.some(m => {
            return m.target.x === tx
                && m.target.y === ty
                && m.source.x === x
                && m.source.y === y
        });
    }

    getPiece(x, y) {
        return this.pieces.find(p => p.x === x && p.y === y)
    }


    draw() {
        this.drawBoard();
        this.pieces.forEach(piece => piece.draw());
    }

    drawBoard() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (coordsToIndex(x, y) === this.selected) {
                    fill(100, 0, 0)
                } else if (this.possibleMoves.find(m => m.target.x === x && m.target.y === y)) {
                    fill(200, 0, 0);
                } else if ((x + y) % 2) {
                    fill(230);
                } else {
                    fill(20);
                }
                rect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            }
        }
    }

    startNextTransition() {
        const nextMove = this.moveQueue.shift();
        if (!nextMove) {
            return null;
        } else {
            this.movePiece(nextMove);
        }
    }

    movePiece(nextMove) {
        const piece = nextMove.source && this.getPiece(nextMove.source.x, nextMove.source.y);
        piece.move(nextMove.target.x, nextMove.target.y);
        if (nextMove.type === "JUMP") {
            this.removePiece(nextMove.middle.x, nextMove.middle.y);
        }
    }

    removePiece(x, y) {
        const victimIndex = this.pieces.findIndex(p => x === p.x && y === p.y);
        this.pieces.splice(victimIndex, 1)
    }

    addMovesToQueue(moves) {
        for (let move of moves) {
            this.moveQueue.push(move);
        }
    }
}

const coordsToIndex = (x, y) => x + (y * 8);
const indexToX = i => i % 8;
const indexToY = i => Math.floor(i / 8);
