class AI {

    getMove(checkers) {
        const playerPieces = checkers.board
            .map((c, i) => ({
                x: indexToX(i),
                y: indexToY(i),
                color: c
            }))
            .filter(c => c.color === RED);

        const jumps = playerPieces
            .flatMap(p => checkers.getJumps(p.x, p.y));

        if (jumps.length > 0) {
            return jumps[0]
        }

        const moves = playerPieces
            .flatMap(p => checkers.getMoves(p.x, p.y));

        return moves && moves[0]
    }

    // private methods
}