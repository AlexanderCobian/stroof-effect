const animals = [
	['🐕','woof','sounds/woof.wav'],
	['🐈','meow','sounds/meow.wav'],
	['🐒','ook ook','sounds/ookook.wav'],
	['🐎','neigh','sounds/neigh.wav'],
	['🐁','squeak','sounds/squeak.wav'],
	['🐖','oink','sounds/oink.wav'],
	['🐑','baa','sounds/baa.wav'],
	['🐦‍⬛','caw','sounds/caw.wav'],
	['🦆','quack','sounds/quack.wav'],
	['🐄','moo','sounds/moo.wav'],
]
const emojiDisplay = document.getElementById('emoji-display');
const nameDisplay = document.getElementById('name-display');
const timerContainer = document.getElementById('timer-container');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');
const scoreDisplay = document.getElementById('score-display');
const feedbackDisplay = document.getElementById('feedback-display');
const instructionDisplay1 = document.getElementById('instruction-display-1');
const instructionDisplay2 = document.getElementById('instruction-display-2');
const initialMaxTime = 3000;
const decayRate = .98;
const audioBuffers = [];
let audioCtx = null;
let audioMode = false;
let matched;
let score;
let maxTime;
let timeRemaining;
let gameInterval;
let gameRunning = false;
let canStart = true;
let emojiIndex = 0;
let soundIndex = 1;

function playSound(index) {
	const src = audioCtx.createBufferSource();
	src.buffer = audioBuffers[index];
	src.connect(audioCtx.destination);
	src.start(0);
}

function startGame() {
	canStart = false;
	gameRunning = true;
	resetScore();
	maxTime = initialMaxTime;
	timeRemaining = maxTime;
	gameInterval = setInterval(tick,10);
	feedbackDisplay.innerHTML = '&nbsp;';
	instructionDisplay1.innerText = 'J/right tap: Match';
	instructionDisplay2.innerText = 'F/left tap: Mismatch';
	nameDisplay.innerHTML = '&nbsp;';
	randomizeAnimal();
}

function resetScore() {
	score = 0;
	scoreDisplay.innerText = 'Score: ' + String(score);
}

function incrementScore(){
	score += 1;
	scoreDisplay.innerText = 'Score: ' + String(score);
}

function tick() {
	timeRemaining -= 10;
	
	let timeRemainingToDisplay = Math.round(timeRemaining/10)/100
	let maxTimeToDisplay = Math.round(maxTime/10)/100
	
	timerText.innerText = `${timeRemainingToDisplay}/${maxTimeToDisplay}`;
	const percentage = timeRemaining / maxTime;
	timerBar.style.width = `${percentage * 100}%`;
	if(timeRemaining <= 0){
		gameOver('Out of time!');
	}
}

function handleGuess(guessMatched) {
	if (guessMatched === matched) {
		incrementScore();
		timeRemaining = maxTime;
		randomizeAnimal();
		maxTime *= decayRate;
	} else {
		if(matched){
			gameOver('Those DO match!');
		} else {
			gameOver('Those don\'t match!');
		}
	}
}

function gameOver(reason) {
	gameRunning = false;
	clearInterval(gameInterval);
	feedbackDisplay.innerText = 'Game over! ' + reason + '\n\u00A0';
	instructionDisplay1.innerHTML = '&nbsp;';
	instructionDisplay2.innerHTML = '&nbsp;';
	setTimeout(() => {
		canStart = true;
		instructionDisplay1.innerText = 'F/left tap: Begin with text';
		instructionDisplay2.innerText = 'J/right tap: Begin with audio';
	}, 2000);
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
	if (audioMode) {
		playSound(soundIndex);
	} else {
		nameDisplay.innerText = animals[soundIndex][1];
	}
}

window.addEventListener('keydown', (event) => {
	if (event.repeat) return;
	if (event.code === 'KeyF'){
		handleInput('left');
	} else if (event.code === 'KeyJ'){
		handleInput('right');
	}
});

window.addEventListener('touchstart', (e) => {
	const x = e.touches[0].clientX;
	if (x < window.innerWidth / 2) {
		handleInput('left');
	} else {
		handleInput('right');
	}
});

function handleInput(side) {
	if (!audioCtx) {
		audioCtx = new AudioContext();
		audioCtx.resume();
		Promise.all(animals.map((animal, i) =>
			fetch(animal[2])
				.then(r => r.arrayBuffer())
				.then(buf => audioCtx.decodeAudioData(buf))
				.then(decoded => { audioBuffers[i] = decoded; })
		));
		instructionDisplay1.innerText = 'F/left tap: Begin with text';
		instructionDisplay2.innerText = 'J/right tap: Begin with audio';
		return;
	}
	if (gameRunning) {
		if (side == 'left'){
			handleGuess(false);
		} else if (side == 'right'){
			handleGuess(true);
		}
	} else if (canStart) {
		if (side == 'left'){
			audioMode = false;
		} else {
			audioMode = true;
		}
		startGame();
	}
}