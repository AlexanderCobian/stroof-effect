const animals = [
	['🐕','woof'],
	['🐈','meow'],
	['🐒','ook ook'],
	['🐎','neigh'],
	['🐁','squeak'],
	['🐖','oink'],
	['🐑','baa'],
]
const emojiDisplay = document.getElementById('emoji-display');
const nameDisplay = document.getElementById('name-display');
const timerContainer = document.getElementById('timer-container');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');
const scoreDisplay = document.getElementById('score-display');
const textDisplay = document.getElementById('text-display');
const initialMaxTime = 5000;
let matched;
let score;
let maxTime;
let timeRemaining;
let gameInterval;
let gameRunning = false;
let emojiIndex = 0;
let soundIndex = 1;

function startGame() {
	gameRunning = true;
	resetScore();
	maxTime = initialMaxTime;
	timeRemaining = maxTime;
	gameInterval = setInterval(tick,10);
	randomizeAnimal();
}

function resetScore() {
	score = 0;
	scoreDisplay.innerText = "Score: " + String(score);
}

function incrementScore(){
	score += 1;
	scoreDisplay.innerText = "Score: " + String(score);
}

function tick() {
	timeRemaining -= 10;
	
	timerText.innerText = `${Math.round(timeRemaining)/1000}/${Math.round(maxTime)/1000}`;
	const percentage = timeRemaining / maxTime;
	timerBar.style.width = `${percentage * 100}%`;
	if(timeRemaining <= 0){
		gameOver("Ran out of time!");
	}
}

function handleGuess(guessMatched) {
	if (guessMatched === matched) {
		incrementScore();
		timeRemaining = maxTime;
		randomizeAnimal();
		maxTime *= .99;
	} else {
		gameOver("Wrong answer!");
	}
}

function gameOver(reason) {
	gameRunning = false;
	clearInterval(gameInterval);
	textDisplay.innerText = "Game over! " + reason + "\n(Space to replay)";
}

function randomizeAnimal() {
	let x = Math.floor(Math.random()*(animals.length-1));
	if (x >= emojiIndex) {
		x++;
	}
	emojiIndex = x;
	if (Math.random() < 0.5) {
		matched = true;
		soundIndex = emojiIndex;
	} else {
		matched = false;
		soundIndex = Math.floor(Math.random()*(animals.length-1));
		if (soundIndex >= emojiIndex) {
			soundIndex++;
		}
	}
	emojiDisplay.innerText = animals[emojiIndex][0];
	nameDisplay.innerText = animals[soundIndex][1];
}

window.addEventListener('keydown', (event) => {
	if (event.repeat) return;
	if (gameRunning) {
		if (event.code === 'ShiftLeft') {
			handleGuess(true);
		} else if (event.code === 'ShiftRight') {
			handleGuess(false);
		}
	} else {
		if (event.code === 'Space'){
			startGame();
		}
	}
	
});	