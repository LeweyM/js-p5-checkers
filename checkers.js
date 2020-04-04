const PAWN = "PAWN";
const KING = "KING";


class Checkers {
    board;
    redAi;
    blueAi;

    constructor(redAi, blueAi) {
        this.redAi = redAi;
        this.blueAi = blueAi;
        this.board = [];
    }

    getInitialPositions() {
        this.board = [];
        this.setupRed();
        this.setupBlue();
        return this.board
            .map((piece, i) =>
                ({
                    x: indexToX(i),
                    y: indexToY(i),
                    value: piece.color
                }))
            .filter(c => !!c)
    }

    startGame() {
        this.getInitialPositions();
        return this.getAiOrHumanMove(this.blueAi, BLUE)
    }

    getPossibleMoves(x, y, player) {
        const forcedPlayerMoves = this.getAllForcedMoves(player);
        if (forcedPlayerMoves.length > 0) {
            return forcedPlayerMoves.filter(m => m.source.x === x && m.source.y === y)
        } else {
            const moves = this.getMoves(x, y, player, this.getRank(x, y));
            const jumps = this.getJumps(x, y, player, this.getRank(x, y));
            return jumps.concat(moves)
        }
    }

    makeMove(move) {
        return this.move(move, BLUE);
    }

    isWinner() {
        if (this.board.filter(p => p.color === RED).length < 1) {
            return BLUE;
        } else if (this.board.filter(p => p.color === BLUE).length < 1) {
            return RED;
        } else if (this.isDraw()) {
            return "DRAW"
        } else {
            return null
        }
    }

    // private methods

    isDraw() {
        //todo
        return false;
    }

    move(move, player) {
        this.updateBoard(move, player);
        const moves = [move];

        if (this.onLastRank(move.target.y, player)) {
            this.promote(move.target.x, move.target.y);
            moves.push({type: "PROMOTE", source: {x: move.target.x, y:move.target.y}})
        }

        const winner = this.isWinner();
        if (winner) {
            moves.push({type: "GAME_OVER", winner: winner})
        }

        if (this.canDoubleJump(move.target.x, move.target.y, move.type, player)) {
            return [...moves, ...(this.getRepeatMove(player))]
        } else {
            return [...moves, ...(this.getOpponentMove(player))]
        }
    }

    getOpponentMove(player) {
        return player === BLUE ? this.getRedMove.bind(this)() : this.getBlueMove.bind(this)();
    }

    getRepeatMove(player) {
        return player === BLUE ? this.getBlueMove.bind(this)() : this.getRedMove.bind(this)();
    }

    canDoubleJump(x, y, type, player) {
        let jumps = this.getJumps(x, y, player, this.getRank(x, y));
        return type === "JUMP" && jumps.length > 0;
    }

    getRedMove() {
        const forcedMoves = this.getAllForcedMoves(RED);

        if (forcedMoves.length === 1) {
            return this.move(forcedMoves[0], RED)
        } else {
            return this.getAiOrHumanMove(this.redAi, RED)
        }
    }

    getBlueMove() {
        let forcedMoves = this.getAllForcedMoves(BLUE);

        if (forcedMoves.length === 1) {
            return this.move(forcedMoves[0], BLUE)
        } else {
            return this.getAiOrHumanMove(this.blueAi, BLUE)
        }
    }

    getAiOrHumanMove(ai, player) {
        if (!ai) {
            return []
        } else {
            const aiMove = ai.getMove(this);

            if (!aiMove) {
                return [];
            } else {
                return this.move(aiMove, player)
            }
        }
    }

    getAllForcedMoves(player) {
        const forcedMoves = [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.getColor(x, y) === player) {
                    const jumps = this.getJumps(x, y, player, this.getRank(x, y));
                    forcedMoves.push(...jumps);
                }
            }
        }
        return forcedMoves;
    }

    updateBoard(move, player) {
        if (move.type === "JUMP") {
            this.set(move.middle.x, move.middle.y, EMPTY)
        }
        const oldRank = this.getRank(move.source.x, move.source.y);
        this.set(move.source.x, move.source.y, EMPTY);
        this.set(move.target.x, move.target.y, player, oldRank);
    }

    setupRed() {
        for (let x = 0; x < 8; x++) {
            for (let y = 5; y < 8; y++) {
                if ((x + y) % 2) {
                    this.set(x, y, RED)
                }
            }
        }
    }

    setupBlue() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 3; y++) {
                if ((x + y) % 2) {
                    this.set(x, y, BLUE)
                }
            }
        }
    }

    getJumps(x, y, player, rank) {
        const potentialJumps = [
            {x: x + 2, y: player === BLUE ? y + 2 : y - 2},
            {x: x - 2, y: player === BLUE ? y + 2 : y - 2}
        ];

        const kingJumps = [
            {x: x + 2, y: player === BLUE ? y - 2 : y + 2},
            {x: x - 2, y: player === BLUE ? y - 2 : y + 2}
        ];

        if (rank === KING) potentialJumps.push(...kingJumps);

        return potentialJumps
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.getColor(m.x, m.y) === EMPTY)
            .filter(m => {
                let middleValue = this.getColor((m.x + x) / 2, (m.y + y) / 2);
                return middleValue === (player === BLUE ? RED : BLUE);
            })
            .map(m => ({
                type: "JUMP",
                source: {x: x, y: y},
                middle: {x: (m.x + x) / 2, y: (m.y + y) / 2},
                target: m
            }))

    }

    getMoves(x, y, player, rank) {
        const potentialMoves = [
            {x: x + 1, y: player === BLUE ? y + 1 : y - 1},
            {x: x - 1, y: player === BLUE ? y + 1 : y - 1}
        ];

        const kingMoves = [
            {x: x + 1, y: player === BLUE ? y - 1 : y + 1},
            {x: x - 1, y: player === BLUE ? y - 1 : y + 1}
        ];

        if (rank === KING) potentialMoves.push(...kingMoves);

        return potentialMoves
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.getColor(m.x, m.y) === EMPTY)
            .map(m => ({
                type: "MOVE",
                source: {x: x, y: y},
                target: m
            }))
    }

    set(x, y, value, rank) {
        const i = (y * 8) + x;
        this.board[i] = {
            color: value,
            rank: rank || PAWN
        }
    }

    promote(x, y) {
        const i = (y * 8) + x;
        this.board[i].rank = KING
    }

    onLastRank(y, player) {
        const lastRank = player === BLUE ? 7 : 0;
        return y === lastRank;
    }

    getColor(x, y) {
        const checker = this.get(y, x);
        return checker ? checker.color : EMPTY
    }

    getRank(x, y) {
        const checker = this.get(y, x);
        return checker.rank
    }

    get(y, x) {
        const i = (y * 8) + x;
        return this.board[i];
    }
}
