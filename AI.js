class AI {
    color;

    constructor(color) {
        this.color = color;
    }

    getMove(checkers) {
        const aiPieces = checkers.board
            .map((piece, i) => ({
                x: indexToX(i),
                y: indexToY(i),
                color: piece.color
            }))
            .filter(c => c.color === this.color);

        const jumps = aiPieces
            .flatMap(p => checkers.getJumps(p.x, p.y, this.color, checkers.getRank(p.x, p.y)));

        if (jumps.length > 0) {
            return jumps[0]
        }

        const moves = aiPieces
            .flatMap(p => checkers.getMoves(p.x, p.y, this.color, checkers.getRank(p.x, p.y)));

        return moves && moves[(floor(random(0, moves.length)))]
    }

    // private methods
}