export default class AI {
    color;

    constructor(color) {
        this.color = color;
    }

    nextMove(availableMoves) {
        const jumps = availableMoves.filter(m => m.type === "JUMP");
        if (jumps.length > 0) {
            return this.decide(jumps)
        }
        const moves = availableMoves.filter(m => m.type === "MOVE");
        return moves && this.decide(moves)
    }

    // private methods

    decide(possibleMoves) {
        //default random
        const i = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[i]
    }
}