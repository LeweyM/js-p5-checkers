const EMPTY = "EMPTY";
const BLUE = "BLUE";
const RED = "RED";

class Board {
    board = [];
    size;
    scale;
    ai;
    selected;
    possibleMoves;

    constructor(size, ai) {
        this.size = size;
        this.scale = size / 8;
        this.ai = ai;
        this.selected = null;
        this.possibleMoves = [];

        this.fillEmptyBoard();
        this.setupBlue();
        this.setupRed();
    }

    setupBlue() {
        for (let x = 0; x < 8; x++) {
            for (let y = 5; y < 8; y++) {
                if ((x + y) % 2) {
                    this.set(x, y, RED)
                }
            }
        }
    }

    setupRed() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 3; y++) {
                if ((x + y) % 2) {
                    this.set(x, y, BLUE)
                }
            }
        }
    }

    fillEmptyBoard() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                this.board.push({
                    x: x,
                    y: y,
                    value: EMPTY
                })
            }
        }
    }

    click(xPos, yPos) {
        const x = Math.floor(xPos / this.scale);
        const y = Math.floor(yPos / this.scale);

        let possibleMove = this.possibleMoves.find(m => m.target.x === x && m.target.y === y);
        if (possibleMove) {
            this.move(possibleMove);

            const aiResp = this.ai.getMove(this);
            if (aiResp) {
                this.move(aiResp)
            }
        } else {
            this.selectCell(x, y)
        }
    }

    selectCell(x, y) {
        this.possibleMoves = [];
        this.selected = null;

        if (this.isCurrentPlayerPiece(x, y)) {
            this.selected = coordsToIndex(x, y);
            this.getMoves(x, y, true).forEach(m => {
                this.possibleMoves.push(m)
            });
            this.getJumps(x, y, true).forEach(m => {
                this.possibleMoves.push(m)
            })
        }
    }

    getPlayerPieces(piece) {
        return this.board.filter(c => c.value === piece)
    }

    isCurrentPlayerPiece(x, y) {
        return this.get(x, y) === BLUE;
    }

    get(x, y) {
        const i = (y * 8) + x;
        return this.board[i].value
    }

    set(x, y, value) {
        const i = (y * 8) + x;
        this.board[i].value = value
    }

    draw() {
        this.board.forEach((cell, i) => {
            if (i === this.selected) {
                fill(100, 0, 0)
            } else if (this.possibleMoves.find(m => m.target.x === indexToX(i) && m.target.y === indexToY(i))) {
                fill(200, 0, 0);
            } else if ((i + cell.y) % 2) {
                fill(230);
            } else {
                fill(20);
            }
            rect(cell.x * this.scale, cell.y * this.scale, this.scale, this.scale);

            if (cell.value === BLUE) {
                fill(0, 0, 255);
                this.drawChecker(cell);
            } else if (cell.value === RED) {
                fill(255, 0, 0);
                this.drawChecker(cell);
            }
        })
    }

    drawChecker(cell) {
        ellipse(cell.x * this.scale + (this.scale * 0.5), cell.y * this.scale + (this.scale * 0.5), this.scale * 0.7);
        noFill();
        ellipse(cell.x * this.scale + (this.scale * 0.5), cell.y * this.scale + (this.scale * 0.5), this.scale * 0.5)
    }

    getJumps(x, y, isPlayer) {
        const potentialJumps = [
            {x: x + 2, y: isPlayer ? y + 2 : y - 2},
            {x: x - 2, y: isPlayer ? y + 2 : y - 2}
        ];

        return potentialJumps
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.get(m.x, m.y) === EMPTY)
            .filter(m => {
                let middleValue = this.get((m.x + x) / 2, (m.y + y) / 2);
                return middleValue === (isPlayer ? RED : BLUE);
            })
            .map(m => ({
                type: "JUMP",
                source: {x: x, y: y},
                middle: {x: (m.x + x) / 2, y: (m.y + y) / 2},
                target: m
            }))

    }

    getMoves(x, y, isPlayer) {
        const potentialMoves = [
            {x: x + 1, y: isPlayer ? y + 1 : y - 1},
            {x: x - 1, y: isPlayer ? y + 1 : y - 1}
        ];

        return potentialMoves
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.get(m.x, m.y) === EMPTY)
            .map(m => ({
                type: "MOVE",
                source: {x: x, y: y},
                target: m
            }))
    }

    move(m) {
        const piece = this.get(m.source.x, m.source.y);

        if (m.type === "JUMP") {
            this.set(m.middle.x, m.middle.y, EMPTY)
        }

        this.set(m.source.x, m.source.y, EMPTY);
        this.set(m.target.x, m.target.y, piece);

        this.possibleMoves = [];
        this.selected = null;
    }

}

const coordsToIndex = (x, y) => x + (y * 8);
const indexToX = i => i % 8;
const indexToY = i => Math.floor(i / 8);
