import { SnakeGame, createSnake } from 'snake-lib';
import { TerminalRenderer } from './terminal-renderer';

const game = new SnakeGame(30, 20, TerminalRenderer);
const snake = createSnake(15, 10, 'right');
game.add(snake.chunks);

// Game loop.
const timer = setInterval(() => {
    game.update();
    if (game.state == 'game over') 
        clearInterval(timer);
}, 300);
