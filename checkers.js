const PAWN = "PAWN";
const KING = "KING";


class Checkers {
    board;
    ai;

    constructor(ai) {
        this.ai = ai;
        this.board = [];
    }

    getPossibleMoves(x, y) {
        const forcedPlayerMoves = this.getAllForcedMoves(true);
        if (forcedPlayerMoves.length > 0) {
            return forcedPlayerMoves.filter(m => m.source.x === x && m.source.y === y)
        } else {
            const moves = this.getMoves(x, y, true, this.getRank(x, y));
            const jumps = this.getJumps(x, y, true, this.getRank(x, y));
            return jumps.concat(moves)
        }
    }

    getSetupPieces() {
        this.setupBlue();
        this.setupRed();
        return this.board
            .map((piece, i) =>
                ({
                    x: indexToX(i),
                    y: indexToY(i),
                    value: piece.color
                }))
            .filter(c => !!c)
    }

    makeMove(move) {
        return this.move(move, true);
    }

    // private methods

    move(move, isPlayer) {
        this.updateBoard(move, isPlayer ? BLUE : RED);
        const moves = [move];

        if (this.onLastRank(move.target.y, isPlayer)) {
            this.promote(move.target.x, move.target.y);
            moves.push({type: "PROMOTE", source: {x: move.target.x, y:move.target.y}})
        }

        if (this.canDoubleJump(move.target.x, move.target.y, move.type, isPlayer)) {
            return [...moves, ...(this.getRepeatMove(isPlayer)())]
        } else {
            return [...moves, ...(this.getOpponentMove(isPlayer)())]
        }
    }

    getOpponentMove(isPlayer) {
        return isPlayer ? this.getComputerMove.bind(this) : this.getHumanMove.bind(this);
    }

    getRepeatMove(isPlayer) {
        return isPlayer ? this.getHumanMove.bind(this) : this.getComputerMove.bind(this);
    }

    canDoubleJump(x, y, type, isPlayer) {
        let jumps = this.getJumps(x, y, isPlayer, this.getRank(x, y));
        return type === "JUMP" && jumps.length > 0;
    }

    getComputerMove() {
        const forcedMoves = this.getAllForcedMoves(false);

        if (forcedMoves.length === 1) {
            return this.move(forcedMoves[0], false)
        }

        const aiMove = this.ai.getMove(this);

        if (!aiMove) {
            return [];
        } else {
            return this.move(aiMove, false)
        }
    }

    getHumanMove() {
        let forcedMoves = this.getAllForcedMoves(true);

        if (forcedMoves.length === 1) {
            return this.move(forcedMoves[0], true)
        } else {
            return []
        }
    }

    getAllForcedMoves(isPlayer) {
        const forcedMoves = [];
        const color = isPlayer ? BLUE : RED;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.getColor(x, y) === color) {
                    const jumps = this.getJumps(x, y, isPlayer, this.getRank(x, y));
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

    getJumps(x, y, isPlayer, rank) {
        const potentialJumps = [
            {x: x + 2, y: isPlayer ? y + 2 : y - 2},
            {x: x - 2, y: isPlayer ? y + 2 : y - 2}
        ];

        const kingJumps = [
            {x: x + 2, y: isPlayer ? y - 2 : y + 2},
            {x: x - 2, y: isPlayer ? y - 2 : y + 2}
        ];

        if (rank === KING) potentialJumps.push(...kingJumps);

        return potentialJumps
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.getColor(m.x, m.y) === EMPTY)
            .filter(m => {
                let middleValue = this.getColor((m.x + x) / 2, (m.y + y) / 2);
                return middleValue === (isPlayer ? RED : BLUE);
            })
            .map(m => ({
                type: "JUMP",
                source: {x: x, y: y},
                middle: {x: (m.x + x) / 2, y: (m.y + y) / 2},
                target: m
            }))

    }

    getMoves(x, y, isPlayer, rank) {
        const potentialMoves = [
            {x: x + 1, y: isPlayer ? y + 1 : y - 1},
            {x: x - 1, y: isPlayer ? y + 1 : y - 1}
        ];

        const kingMoves = [
            {x: x + 1, y: isPlayer ? y - 1 : y + 1},
            {x: x - 1, y: isPlayer ? y - 1 : y + 1}
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

    getColor(x, y) {
        const i = (y * 8) + x;
        const checker = this.board[i];
        return checker ? checker.color : EMPTY
    }

    onLastRank(y, isPlayer) {
        const lastRank = isPlayer ? 7 : 0;
        return y === lastRank;
    }

    getRank(x, y) {
        const i = (y * 8) + x;
        const checker = this.board[i];
        return checker.rank
    }
}