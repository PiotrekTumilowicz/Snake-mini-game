'use strict'
 const playBoard = document.querySelector('.play-board')
 const scoreElement = document.querySelector('.score')
 const highScoreElement = document.querySelector('.high-score')
 const controls = document.querySelectorAll('.controls i')

 let gameOver = false
 let foodX, foodY
 let snakeX = 15,
 	snakeY = 15
 let velocityX = 0,
 	velocityY = 0
 let snakeBody = []
 let setIntervalID
 let score = 0
 let speed = 1

 // Get high score from local storage

 let highScore = localStorage.getItem('high-score') || 0
 highScoreElement.innerText = `High Score: ${highScore}`

 // Pass a random bectween 1 and 30 as food position;

 const updateFoodPosition = () => {
 	foodX = Math.floor(Math.random() * 30) + 1
 	foodY = Math.floor(Math.random() * 30) + 1
 }

 const handleGameOver = () => {
 	clearInterval(setIntervalID)
 	alert('Game Over! Press OK to replay...')
 	location.reload()
 }

 //Change velocity value based on ket press

 const changeDirection = e => {
 	if (e.key === 'ArrowUp' && velocityY != 1) {
 		velocityX = 0
 		velocityY = -speed
 	} else if (e.key === 'ArrowDown' && velocityY != -1) {
 		velocityX = 0
 		velocityY = speed
 	} else if (e.key === 'ArrowLeft' && velocityX != 1) {
 		velocityX = -speed
 		velocityY = 0
 	} else if (e.key === 'ArrowRight' && velocityX != -1) {
 		velocityX = speed
 		velocityY = 0
 	}
 }

 //Change direction on each key click

 controls.forEach(button =>
 	button.addEventListener('click', () =>
 		changeDirection({
 			key: button.dataset.key,
 		})
 	)
 )

 const initGame = () => {
 	if (gameOver) return handleGameOver()
 	let html = `<div class = "food" style = "grid-area: ${foodY} / ${foodX}"></div>`

 	// When nake eat food
 	if ((snakeX === foodX) & (snakeY === foodY)) {
 		updateFoodPosition()

 		snakeBody.push([foodY, foodX]) // Add food to snake body array
 		score++

 		highScore = score >= highScore ? score : highScore // if score > highscore => high score = score

 		localStorage.setItem('high-score', highScore)
 		scoreElement.innerText = `Score: ${score}`
 		highScoreElement.innerText = `High Score: ${highScore}`
 	}

 	// Update Snake Head
 	snakeX += velocityX
 	snakeY += velocityY

 	// Shifting forward values of elements in snake body by one
 	for (let i = snakeBody.length - 1; i > 0; i--) {
 		snakeBody[i] = snakeBody[i - 1]
 		console.log(i)
