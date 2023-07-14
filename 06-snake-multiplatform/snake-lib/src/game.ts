import { createFood, isFood } from './food';
import { type SnakeHead, addChunk, isSnakeHead, updateSnakePosition } from './snake';

export type Renderer = {
    draw: (game: SnakeGame) => void;
};

export type GameObject = {
    name: string;
    x: number;
    y: number;
};

export type WorldBoundaries = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

export class SnakeGame {
    state: 'running' | 'game over' = 'running';
    gameObjects: GameObject[] = [];

    readonly width: number;
    readonly height: number;
    readonly worldBoundaries: WorldBoundaries;

    private readonly renderer: Renderer;

    constructor(width: number, height: number, renderer: Renderer) {
        this.width = width;
        this.height = height;
        this.renderer = renderer;

        this.worldBoundaries = {
            left: 1,
            right: width - 1,
            top: 1,
            bottom: height - 1
        };
    }

    update(): void {
        if (this.state != 'running') return;

        this.gameObjects.forEach((gameObject, index) => {
            // TODO Check if snake crashed.

            if (isSnakeHead(gameObject)) {
                // Move snake.
                updateSnakePosition(gameObject);
            }

            // Check if snake ate food.
            if (isFood(gameObject)) {
                const snakeHead = this.gameObjects.find((go) => {
                    return isSnakeHead(go) && gameObject.x == go.x && gameObject.y == go.y;
                }) as SnakeHead | undefined;

                if (snakeHead) {
                    const newChunk = addChunk(snakeHead);
                    this.gameObjects.push(newChunk);
                    // Replace food.
                    this.gameObjects[index] = createFood(this.worldBoundaries);
                }
            }
        });

        // Draw current state.
        this.renderer.draw(this);
    }

    add(gameObject: GameObject): void;
    add(gameObjects: GameObject[]): void;
    add(gameObject: GameObject | GameObject[]): void {
        if (Array.isArray(gameObject)) {
            this.gameObjects.push(...gameObject);
        } else {
            this.gameObjects.push(gameObject);
        }
    }
}
