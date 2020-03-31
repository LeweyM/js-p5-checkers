/// <reference path="./p5.d/p5.global-mode.d.ts" />

let board;
let ai;

function setup() {
	createCanvas(400, 400);
	ai = new AI();
	board = new Board(400, ai)
}

function mouseClicked() {
	board.click(mouseX, mouseY)
}

function draw() {
	background(220);
	board.draw();
}
