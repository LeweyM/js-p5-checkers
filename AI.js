class AI {
    color;

    constructor(color) {
        this.color = color;
    }

    nextMove(availableMoves) {

        const jumps = availableMoves.filter(m => m.type === "JUMP");

        if (jumps.length > 0) {
            return jumps[0]
        }

        const moves = availableMoves.filter(m => m.type === "MOVE");


        return moves && moves[(floor(random(0, moves.length)))]
    }

    // private methods
}