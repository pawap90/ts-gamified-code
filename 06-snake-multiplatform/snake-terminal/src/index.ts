import { SnakeGame, createSnakeHead } from 'snake-lib';
import { TerminalRenderer } from './terminal-renderer';
import { emitKeypressEvents } from 'readline';

const game = new SnakeGame(30, 20, TerminalRenderer);
const snakeHead = createSnakeHead(15, 10, 'right');
game.add(snakeHead);

emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

// Handle user input.
process.stdin.on('keypress', (chunk, key) => {
    switch (key.name) {
        case 'q':
            process.exit();
        case 'up':
            snakeHead.direction = 'up';
            break;
        case 'down':
            snakeHead.direction = 'down';
            break;
        case 'left':
            snakeHead.direction = 'left';
            break;
        case 'right':
            snakeHead.direction = 'right';
            break;
    }
});


// Game loop.
const timer = setInterval(() => {
    game.update();
    if (game.state == 'game over') 
        clearInterval(timer);
}, 300);
