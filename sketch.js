/// <reference path="./p5.d/p5.global-mode.d.ts" />

let board;
let ANIMATIONDURATION = 0;
let durationSlider;
let winnerCounter = {[RED]: 0, [BLUE]: 0, ["DRAW"]: 0};

function setup() {
	createCanvas(400, 450);
	durationSlider = createSlider(0, 40, 5);
	const redAi = new AI(RED);
	const blueAi = new AI(BLUE);
	const checkers = new Checkers(redAi, blueAi);
	board = new Board(400, checkers)
}

function mouseClicked() {
	board.click(mouseX, mouseY)
}

function draw() {
	background(220);
	ANIMATIONDURATION = 40 - durationSlider.value();
	board.draw();

	textSize(32);
	fill(50);
	text(`blue[${winnerCounter[BLUE]}], red[${winnerCounter[RED]}], draw[${winnerCounter.DRAW}]`, 0, 440)
}
