class AI {
    constructor() {
    }

    getMove(board) {
        const jumps = board.getPlayerPieces(RED)
            .flatMap(p => board.getJumps(p.x, p.y));

        if (jumps.length > 0) {
            return jumps[0]
        }

        const moves = board.getPlayerPieces(RED)
            .flatMap(p => board.getMoves(p.x, p.y));

        return moves && moves[0]
    }
}