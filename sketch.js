/// <reference path="./p5.d/p5.global-mode.d.ts" />

let board;
let game;

function setup() {
	createCanvas(400, 400);
	game = new Checkers();
	board = new Board(400, game)
}

function mouseClicked() {
	board.click(mouseX, mouseY)
}

function draw() {
	background(220);
	board.draw();
}
