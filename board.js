const EMPTY = "EMPTY";

const BLUE = "BLUE";

const RED = "RED";

class Board {
    board = [];
    size;
    scale;
    game;
    selected;
    highLighted;

    constructor(size, game) {
        this.size = size;
        this.scale = size / 8;
        this.game = game;
        this.selected = null;
        this.highLighted = [];

        this.fillEmptyBoard();
        this.setupBlue();
        this.setupRed();

        // this.game.fillStartingPositions((x,y,v) => this.set(x,y,v))
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

        // this.game.click(x, y)
        this.selectCell(x, y)
    }

    selectCell(x, y) {
        this.highLighted = [];
        if (this.currentPlayerPiece(x, y)) {
            this.selected = coordsToIndex(x, y);
            this.getMoves(x, y).forEach(m => {
                this.setHighlighted(m.x, m.y)
            })
        } else {
            this.selected = null;
        }
    }

    currentPlayerPiece(x, y) {
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
            } else if (this.highLighted.includes(i)) {
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

    getMoves(x, y) {
        const potentialMoves = [
            {x: x + 1, y: y + 1},
            {x: x - 1, y: y + 1}
        ];

        return potentialMoves
            .filter(m => this.get(m.x, m.y) === EMPTY)
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0);
    }

    setHighlighted(x, y) {
        this.highLighted.push(coordsToIndex(x, y))
    }

}

const coordsToIndex = (x, y) => x + (y * 8);
