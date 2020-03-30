class Checkers {
    pieces;
    playerOne;
    playerTwo;

    constructor() {
        this.pieces = [];
        this.playerOne = RED;
        this.playerTwo = BLUE;
    }

    fillStartingPositions(setter) {
        this.pieces = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 3; y++){
                if ((x + y) % 2) {
                    this.pieces.push({
                        x: x,
                        y: y,
                        piece: this.playerOne
                    });
                    setter(x, y, BLUE)
                }
            }
        }

        for (let x = 0; x < 8; x++){
            for (let y = 5; y < 8; y++){
                if ((x + y) % 2) {
                    this.pieces.push({
                        x: x,
                        y: y,
                        piece: this.playerTwo
                    });
                    setter(x, y, RED)
                }
            }
        }
    }

    click(x, y) {
        console.log(x, y)
    }
}