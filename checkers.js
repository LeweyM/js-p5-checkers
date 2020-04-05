const PAWN = "PAWN";
const KING = "KING";
const EMPTY = "EMPTY";
const BLUE = "BLUE";
const RED = "RED";

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
        return this.getAiOrHumanMove(BLUE)
    }

    getPossibleMoves(x, y, player) {
        const forcedPlayerMoves = this.getAllForcedMoves(player);
        if (forcedPlayerMoves.length > 0) {
            return forcedPlayerMoves.filter(m => m.source.x === x && m.source.y === y)
        } else {
            const moves = this.getMoves(x, y, player, this.getRank(x, y));
            const jumps = this.getJumps(x, y, player, this.getRank(x, y));
            return [...jumps, ...moves];
        }
    }

    makeMove(move, player) {
        return this.move(move, player);
    }

    isWinner() {
        if (this.board.filter(p => p.color === RED).length < 1) {
            return BLUE;
        } else if (this.board.filter(p => p.color === BLUE).length < 1) {
            return RED;
        } else {
            return null
        }
    }

    // private methods

    availablePlayerMoves(player) {
        const pieces = this.getPieces(player);

        const jumps = pieces
            .flatMap(p => this.getJumps(p.x, p.y, p.color, p.rank));

        const moves = pieces
            .flatMap(p => this.getMoves(p.x, p.y, p.color, p.rank));

        return [...moves, ...jumps];
    }

    getPieces(player) {
        return this.board
            .map((piece, i) => ({
                x: indexToX(i),
                y: indexToY(i),
                color: piece.color,
                rank: piece.rank,
            }))
            .filter(c => c.color === player);
    }

    move(move, player) {
        this.updateBoard(move, player);
        const moves = [move];

        if (this.onLastRank(move.target.y, player)) {
            this.promote(move.target.x, move.target.y);
            moves.push({type: "PROMOTE", source: {x: move.target.x, y: move.target.y}})
        }

        const winner = this.isWinner();
        if (winner) {
            return moves.concat({type: "GAME_OVER", winner: winner});
        }

        if (this.canDoubleJump(move.target.x, move.target.y, move.type, player)) {
            return [...moves, ...(this.getMove(player))]
        } else {
            return [...moves, ...(this.getMove(this.opponent(player)))]
        }
    }

    opponent(player) {
        return {
            [RED]: BLUE,
            [BLUE]: RED
        }[player];
    }

    canDoubleJump(x, y, type, player) {
        let jumps = this.getJumps(x, y, player, this.getRank(x, y));
        return type === "JUMP" && jumps.length > 0;
    }

    getMove(player) {
        const forcedMoves = this.getAllForcedMoves(player);
        if (forcedMoves.length === 1) {
            return this.move(forcedMoves[0], player)
        } else {
            return this.getAiOrHumanMove(player)
        }
    }

    getAiFor(player) {
        return {
            [BLUE]: this.blueAi,
            [RED]: this.redAi
        }[player] || null;
    }

    getAiOrHumanMove(player) {
        const ai = this.getAiFor(player);
        if (!ai) {
            return []
        } else {
            const availableMoves = this.availablePlayerMoves(player);
            if (availableMoves.length === 0) {
                return [{type: "GAME_OVER", winner: "DRAW"}]
            }
            const aiMove = ai.nextMove(availableMoves);
            return aiMove ? this.move(aiMove, player) : [];
        }
    }

    getAllForcedMoves(player) {
        const forcedMoves = [];
        this.iterateBoard((x, y) => {
            if (this.getColor(x, y) === player) {
                const jumps = this.getJumps(x, y, player, this.getRank(x, y));
                forcedMoves.push(...jumps);
            }
        });
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

    setupRed = () => this.iterateBoard((x, y) => {
        if (y >= 5 && y < 8) this.set(x, y, RED);
    });

    setupBlue = () => this.iterateBoard((x, y) => {
        if (y >= 0 && y < 3) this.set(x, y, BLUE);
    });

    iterateBoard(cb) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) if ((x + y) % 2) cb(x, y)
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
        this.board[this.coordsToIndex(x, y)] = {
            color: value,
            rank: rank || PAWN
        }
    }

    promote = (x, y) => this.board[(this.coordsToIndex(x, y))].rank = KING;

    coordsToIndex = (x, y) => (y * 8) + x;

    onLastRank = (y, player) => y === (player === BLUE ? 7 : 0);

    getColor = (x, y) => this.get(x, y).color;

    getRank = (x, y) => this.get(x, y).rank;

    get = (x, y) => this.board[this.coordsToIndex(x, y)] || {color: EMPTY, rank: null};
}

const indexToX = i => i % 8;
const indexToY = i => Math.floor(i / 8);

module.exports = Checkers;