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
            const moves = this.getMoves(x, y, true);
            const jumps = this.getJumps(x, y, true);
            return jumps.concat(moves)
        }
    }

    getSetupPieces() {
        this.setupBlue();
        this.setupRed();
        return this.board
            .map((val, i) =>
                ({
                    x: indexToX(i),
                    y: indexToY(i),
                    value: val
                }))
            .filter(c => !!c)
    }

    makeMove(move) {
        return this.move(move, true);
    }

    // private methods

    move(move, isPlayer) {
        this.updateBoard(move, isPlayer ? BLUE : RED);

        if (this.canDoubleJump(move, isPlayer)) {
            return [move, ...(this.getRepeatMove(isPlayer)())]
        } else {
            return [move, ...(this.getOpponentMove(isPlayer)())]
        }
    }

    getOpponentMove(isPlayer) {
        return isPlayer ? this.getComputerMove.bind(this) : this.getHumanMove.bind(this);
    }

    getRepeatMove(isPlayer) {
        return isPlayer ? this.getHumanMove.bind(this) : this.getComputerMove.bind(this);
    }

    canDoubleJump(move, isPlayer) {
        let jumps = this.getJumps(move.target.x, move.target.y, isPlayer);
        return move.type === "JUMP" && jumps.length > 0;
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
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === color) {
                const jumps = this.getJumps(indexToX(i), indexToY(i), isPlayer);
                forcedMoves.push(...jumps);
            }
        }
        return forcedMoves;
    }

    updateBoard(move, player) {
        if (move.type === "JUMP") {
            this.set(move.middle.x, move.middle.y, EMPTY)
        }
        this.set(move.source.x, move.source.y, EMPTY);
        this.set(move.target.x, move.target.y, player);
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

    getJumps(x, y, isPlayer) {
        const potentialJumps = [
            {x: x + 2, y: isPlayer ? y + 2 : y - 2},
            {x: x - 2, y: isPlayer ? y + 2 : y - 2}
        ];

        return potentialJumps
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.get(m.x, m.y) === EMPTY)
            .filter(m => {
                let middleValue = this.get((m.x + x) / 2, (m.y + y) / 2);
                return middleValue === (isPlayer ? RED : BLUE);
            })
            .map(m => ({
                type: "JUMP",
                source: {x: x, y: y},
                middle: {x: (m.x + x) / 2, y: (m.y + y) / 2},
                target: m
            }))

    }

    getMoves(x, y, isPlayer) {
        const potentialMoves = [
            {x: x + 1, y: isPlayer ? y + 1 : y - 1},
            {x: x - 1, y: isPlayer ? y + 1 : y - 1}
        ];

        return potentialMoves
            .filter(m => m.x < 8 && m.x >= 0 && m.y < 8 && m.y >= 0)
            .filter(m => this.get(m.x, m.y) === EMPTY)
            .map(m => ({
                type: "MOVE",
                source: {x: x, y: y},
                target: m
            }))
    }

    set(x, y, value) {
        const i = (y * 8) + x;
        this.board[i] = value
    }

    get(x, y) {
        const i = (y * 8) + x;
        return this.board[i] || EMPTY
    }
}