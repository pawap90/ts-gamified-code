import './style.css';

import { SnakeGame, createFood, createSnakeHead } from 'snake-lib';
import { WebRenderer } from './web-renderer';

const webRenderer = new WebRenderer('board', 12, 12);
webRenderer.createBoard();

const game = new SnakeGame(webRenderer.width, webRenderer.height, webRenderer);

const snakeHead = createSnakeHead(6, 6, 'right');
const food = createFood(game.worldBoundaries);
game.add([food, snakeHead]);

// Handle user input.
document.onkeydown = (e: KeyboardEvent) => {
    switch (e.key) {
        case 'ArrowUp':
            snakeHead.direction = 'up';
            break;
        case 'ArrowDown':
            snakeHead.direction = 'down';
            break;
        case 'ArrowLeft':
            snakeHead.direction = 'left';
            break;
        case 'ArrowRight':
            snakeHead.direction = 'right';
            break;
    }
};

// Game loop.
window.setInterval(() => {
    game.update();
}, 400);
