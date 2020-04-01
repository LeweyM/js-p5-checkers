/// <reference path="./p5.d/p5.global-mode.d.ts" />

let board;

function setup() {
	createCanvas(400, 400);
	const ai = new AI();
	const checkers = new Checkers(ai);
	board = new Board(400, checkers)
}

function mouseClicked() {
	board.click(mouseX, mouseY)
}

function draw() {
	background(220);
	board.draw();
}
