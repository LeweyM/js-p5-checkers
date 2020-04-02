class AI {

    getMove(checkers) {
        const aiPieces = checkers.board
            .map((piece, i) => ({
                x: indexToX(i),
                y: indexToY(i),
                color: piece.color
            }))
            .filter(c => c.color === RED);

        const jumps = aiPieces
            .flatMap(p => checkers.getJumps(p.x, p.y, false, checkers.getRank(p.x, p.y)));

        if (jumps.length > 0) {
            console.log(jumps);
            return jumps[0]
        }

        const moves = aiPieces
            .flatMap(p => checkers.getMoves(p.x, p.y, false, checkers.getRank(p.x, p.y)));

        console.log(moves);

        const i = floor(random(0, moves.length));

        return moves && moves[i]
    }

    // private methods
}