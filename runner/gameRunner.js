import AI from "../gameEngine/AI.js";
import {Checkers} from "../gameEngine/checkers.js";
import OneAheadAI from "../gameEngine/OneAheadAI.js";

const redAi = new AI("RED");
const blueOneAhead = new OneAheadAI("BLUE");
const redOneAhead = new OneAheadAI("RED");
const blueAi = new AI("BLUE");
const checkers = new Checkers(redAi, blueAi);

const wins = {
    ["RED"]:0,
    ["BLUE"]:0,
    ["DRAW"]:0,
};

const n = 1000;

for (let i = 0; i < n; i++) {
    const moves = checkers.startGame();
    wins[moves.pop().winner] += 1;
}

function percent(v) {
    return ((100 / n) * v).toFixed(1);
}

console.log(wins);
console.log(`Percentage: Red:${(percent(wins.RED))}%, Blue:${(percent(wins.BLUE))}%, Draw:${(percent(wins.DRAW))}%`);
