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

    // Initialize.
    for (let i = 0; i <= game.height; i++) {
        matrix[i] = new Array(game.width).fill(' ');
    }

    // Draw left & right boundaries
    for (let i = 0; i <= game.height; i++) {
        matrix[i][0] = '│';
        matrix[i][game.width] = '│';
    }

    // Draw top & bottom boundaries.
    matrix[0].fill('─');
    matrix[game.height].fill('─');

    // Draw corners.
    matrix[0][0] = '┌';
    matrix[0][game.width] = '┐';
    matrix[game.height][0] = '└';
    matrix[game.height][game.width] = '┘';

    // Draw game objects.
    for (const gameObject of game.gameObjects) {
        if (isSnakeChunk(gameObject)) matrix[gameObject.y][gameObject.x] = '■';
        if (isFood(gameObject)) matrix[gameObject.y][gameObject.x] = '●';
    }

    return matrix;
}