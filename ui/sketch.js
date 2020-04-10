import {Checkers} from "../gameEngine/checkers.js";
import Board from "./board.js"
import {BLUE, RED} from "../gameEngine/checkers.js";
import AI from "../gameEngine/AI.js";
import OneAheadAI from "../gameEngine/OneAheadAI.js";

// global state bad...
export let winnerCounter = {[RED]: 0, [BLUE]: 0, ["DRAW"]: 0};
export let ANIMATION_DURATION = 0;

let s = (sketch) => {
	let board;
	let checkers;
	let durationSlider;

	sketch.setup = () => {
		const blueAi = new AI();
		const redAi = new AI();
		const blueOneAhead = new OneAheadAI();
		const redOneAhead = new OneAheadAI();

		checkers = new Checkers(redOneAhead, blueOneAhead);
		board = new Board(sketch, 400, checkers);

		sketch.createCanvas(400, 450);
		durationSlider = sketch.createSlider(1, 40, 5);
	};

	sketch.mouseClicked = () => {
		board.click(sketch.mouseX, sketch.mouseY)
	};

	sketch.draw = () => {
		sketch.background(220);
		ANIMATION_DURATION = 40 - durationSlider.value();
		board.draw();

		sketch.textSize(32);
		sketch.fill(50);
		sketch.text(`blue[${winnerCounter[BLUE]}], red[${winnerCounter[RED]}], draw[${winnerCounter.DRAW}]`, 0, 440)
	}
};

let myp5 = new p5(s, 'p5sketch');
