import { SnakeGame, createSnakeHead } from 'snake-lib';
import { TerminalRenderer } from './terminal-renderer';

const game = new SnakeGame(30, 20, TerminalRenderer);
const snakeHead = createSnakeHead(15, 10, 'right');
game.add(snakeHead);

// Game loop.
const timer = setInterval(() => {
    game.update();
    if (game.state == 'game over') 
        clearInterval(timer);
}, 300);
