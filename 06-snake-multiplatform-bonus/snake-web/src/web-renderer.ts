import { Renderer, SnakeGame, isFood, isSnakeChunk } from 'snake-lib';

export class WebRenderer implements Renderer {
    readonly boardId: string;
    width: number;
    height: number;

    constructor(boardId: string, width: number, height: number) {
        this.boardId = boardId;
        this.width = width;
        this.height = height;
    }

    draw(game: SnakeGame) {
        // Draw world on board.
        this.drawBoard(game);

        if (game.state == 'game over') {
            alert('You crashed! Game over');
        }
    }

    createBoard() {
        const board = document.getElementById(this.boardId);

        if (!board) {
            throw new Error(`Could not find board with id ${this.boardId}`);
        }

        board.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;
        board.style.maxWidth = `${this.width * 52}px`;
        board.style.maxHeight = `${this.height * 52}px`;

        // Add rows and cols
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const cell = document.createElement('div');
                cell.id = `col-${i}-${j}`;
                board.appendChild(cell);
            }
        }
    }

    private drawBoard(game: SnakeGame) {
        const board = document.getElementById(this.boardId);

        if (!board) {
            throw new Error(`Could not find board with id ${this.boardId}`);
        }

        // Clear board.
        const cells = Array.from(board.getElementsByTagName('div'));
        cells.forEach((cell) => {
            cell.classList.remove('snake', 'food');
        });

        // Draw game objects.
        for (const gameObject of game.gameObjects) {
            if (isFood(gameObject)) {
                const food = document.getElementById(`col-${gameObject.y}-${gameObject.x}`);
                food?.classList.add('food');
            }
            if (isSnakeChunk(gameObject)) {
                const cell = document.getElementById(`col-${gameObject.y}-${gameObject.x}`);
                cell?.classList.add('snake');
            }
        }
    }
}