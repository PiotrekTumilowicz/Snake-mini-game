const rotateBtn = document.querySelector('#rotate-button');
const optionCont = document.querySelector('.option-container');
const messageCont = document.querySelector('.game-message');
const gamesGridCont = document.querySelector('#gamesGrid-container');
const highScoreElement = document.querySelector('.high-score');
const scoreElement = document.querySelector('.score');

const blockWidth = 10;
let foundShipsCount = 0;
let score = 0;

// Get high score from local storage
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

function createGrid(color, user) {
	const gameBlockContainer = document.createElement('div');

	gameBlockContainer.classList.add('game-grid');
	gameBlockContainer.style.backgroundColor = color;
	gameBlockContainer.id = user;

	for (let i = 0; i < blockWidth * blockWidth; i++) {
		const block = document.createElement('div');
		block.classList.add('block');
		block.id = i;
		gameBlockContainer.append(block);
	}
	gamesGridCont.append(gameBlockContainer);
}
createGrid('#d6cdcd', 'computer');

class Ship {
	constructor(name, length) {
		this.name = name;
		this.length = length;
	}
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

function addShipPiece(ship) {
	const allGridBlocks = document.querySelectorAll(`#computer div`);

	let randomBoolean = Math.random() < 0.5;
	let isHorizontal = randomBoolean;
	let randomStartIndex = Math.floor(Math.random() * blockWidth * blockWidth);
	let validStart;

	if (isHorizontal) {
		if (randomStartIndex <= blockWidth * blockWidth - ship.length) {
			validStart = randomStartIndex;
		} else {
			validStart = blockWidth * blockWidth - ship.length;
		}
	} else {
		if (randomStartIndex <= blockWidth * blockWidth - blockWidth * ship.length) {
			validStart = randomStartIndex;
		} else {
			validStart = randomStartIndex - ship.length * blockWidth + blockWidth;
		}
	}
	let shipBlocks = [];
	for (let i = 0; i < ship.length; i++) {
		if (isHorizontal) {
			shipBlocks.push(allGridBlocks[Number(validStart) + i]);
		} else {
			shipBlocks.push(allGridBlocks[Number(validStart) + i * blockWidth]);
		}
	}
	let valid = false;
	if (isHorizontal) {
		valid = shipBlocks.every(
			(_shipBlock, index) => shipBlocks[0].id % blockWidth !== blockWidth - (shipBlocks.length - (index + 1))
		);
	} else {
		valid = shipBlocks.every((_shipBlock, index) => shipBlocks[0].id < 90 + (blockWidth * index + 1));
	}
	const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));
	if (valid && notTaken) {
		shipBlocks.forEach(shipBlock => {
			shipBlock.classList.add(ship.name);
			shipBlock.classList.add('taken');
		});
	} else {
		addShipPiece(ship);
	}
}
ships.forEach(ship => addShipPiece(ship));

function handleClick(event) {
	const targetBlock = event.target;
	if (
		targetBlock.classList.contains('empty') ||
		targetBlock.classList.contains('boom') ||
		targetBlock.classList.contains('game-grid')
	) {
		return;
	}

	if (targetBlock.classList.contains('taken')) {
		targetBlock.classList.add('boom');
		console.log(targetBlock.classList[1]);
		const shipName = targetBlock.classList[1];
		messageCont.innerHTML = `Boom! You hit a ${shipName}!`;
		const shipBlocks = document.querySelectorAll(`.${targetBlock.classList[1]}`);
		const allShipBlocksHit = Array.from(shipBlocks).every(shipBlock => shipBlock.classList.contains('boom'));
		score++;
		if (allShipBlocksHit) {
			messageCont.innerHTML += `<br>The ${shipName} sunk!`;
			const shipToColor = document.querySelector(`.${shipName}-preview`);
			console.log(shipToColor);
			shipToColor.classList.remove('undestroyed-ship-color');
			shipToColor.classList.add('destroyed-ship-color');
			foundShipsCount++;
			checkGameOver();
		}
	} else {
		targetBlock.classList.add('empty');
		messageCont.innerHTML = `You hit a block!`;
		score++;
	}
	console.log(score);
	scoreElement.innerText = `Current Score: ${100 - score}`;
}
gamesGridCont.addEventListener('click', handleClick);
const resetBtn = document.querySelector('#reset-button');
resetBtn.addEventListener('click', resetGame);

function checkGameOver() {
	if (foundShipsCount === ships.length) {
		const totalMoves = document.querySelectorAll('.boom').length + document.querySelectorAll('.empty').length;
		let  score = 100 - totalMoves;
		messageCont.innerHTML = `Congratulations! <br>You have sunk all the ships! <br>Total moves: ${totalMoves}`;

		highScore = totalMoves >= highScore ? totalMoves : highScore; // if score > highscore => high score = score

		localStorage.setItem('high-score', highScore);
		highScoreElement.innerText = `High Score: ${highScore}`;
	}
}

function startNewGame() {
	resetGame();
	foundShipsCount = 0;
	messageCont.innerHTML = '';
}

function resetGame() {
	const shipBlocks = document.querySelectorAll('.taken');
	shipBlocks.forEach(shipBlock => {
		shipBlock.classList.remove('taken');
		shipBlock.classList.remove('destroyer');
		shipBlock.classList.remove('submarine');
		shipBlock.classList.remove('cruiser');
		shipBlock.classList.remove('battleship');
		shipBlock.classList.remove('carrier');
	});

	const shipOptionsBlocks = document.querySelectorAll('.destroyed-ship-color');
	shipOptionsBlocks.forEach(shipOptionBlock => {
		shipOptionBlock.classList.remove('destroyed-ship-color');
		shipOptionBlock.classList.add('undestroyed-ship-color');
	});

	const boomBlocks = document.querySelectorAll('.boom');
	boomBlocks.forEach(boomBlock => {
		boomBlock.classList.remove('boom');
	});

	const emptyBlocks = document.querySelectorAll('.empty');
	emptyBlocks.forEach(emptyBlock => {
		emptyBlock.classList.remove('empty');
	});

	ships.forEach(ship => addShipPiece(ship));

	messageCont.innerHTML = '';
}
