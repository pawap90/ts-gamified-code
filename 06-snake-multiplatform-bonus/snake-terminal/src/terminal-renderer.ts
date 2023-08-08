import { SnakeGame, Renderer, isSnakeChunk, isFood,  } from 'snake-lib';

export const TerminalRenderer: Renderer = {
    draw(game: SnakeGame) {
        // Get matrix and convert it to string.
        const matrix = toMatrix(game)
            .map((row) => row.join(''))
            .join('\n');

        console.clear();
        console.log(matrix);

        if (game.state == 'game over') {
            console.log('\nYou crashed! Game over');
        }
    }
};

function toMatrix(game: SnakeGame): string[][] {
    const matrix: string[][] = [];
    const board = { width: game.width + 2, height: game.height + 2 }

    // Initialize board.
    for (let i = 0; i < board.height; i++) {
        matrix[i] = new Array(board.width).fill('x');
    }

    // Draw left & right boundaries
    for (let i = 0; i < board.height; i++) {
        matrix[i][0] = '│';
        matrix[i][board.width - 1] = '│';
    }

    // Draw top & bottom boundaries.
    matrix[0].fill('─');
    matrix[board.height - 1].fill('─');

    // Draw corners.
    matrix[0][0] = '┌';
    matrix[0][board.width - 1] = '┐';
    matrix[board.height - 1][0] = '└';
    matrix[board.height - 1][board.width - 1] = '┘';

    // Draw game objects.
    for (const gameObject of game.gameObjects) {
        const boardPosition = { x: gameObject.x + 1, y: gameObject.y + 1 };
        if (isSnakeChunk(gameObject)) matrix[boardPosition.y][boardPosition.x] = '■';
        if (isFood(gameObject)) matrix[boardPosition.y][boardPosition.x] = '●';
    }

    return matrix;
}