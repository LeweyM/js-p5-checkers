import AI from "./AI.js";

export default class OneAheadAI extends AI {
    constructor(color) {
        super(color);
    }

    decide(possibleMoves) {
        return possibleMoves[0];
    }
}