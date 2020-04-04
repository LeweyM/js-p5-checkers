/// <reference path="./p5.d/p5.global-mode.d.ts" />

let board;
let ANIMATIONDURATION = 0;
let durationSlider;

function setup() {
	createCanvas(400, 400);
	durationSlider = createSlider(0, 40, 5);
	const redAi = new AI(RED);
	const blueAi = new AI(BLUE);
	const checkers = new Checkers(null, blueAi);
	board = new Board(400, checkers)
}

function mouseClicked() {
	board.click(mouseX, mouseY)
}

function draw() {
	background(220);
	ANIMATIONDURATION = 40 - durationSlider.value();
	board.draw();
}
