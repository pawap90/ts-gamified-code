import { createFood, isFood } from './food';
import {
    type SnakeHead,
    addChunk,
    isSnakeHead,
    updateSnakePosition,
    crashedWithItself,
    crashedWithWorld
} from './snake';

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
            left: 0,
            right: width - 1,
            top: 0,
            bottom: height - 1
        };
    }

    update(): void {
        if (this.state != 'running') return;

        this.gameObjects.forEach((gameObject, index) => {
            if (isSnakeHead(gameObject)) {
                // Move snake.
                updateSnakePosition(gameObject);

                // Check if snake crashed.
                if (
                    crashedWithItself(gameObject) ||
                    crashedWithWorld(gameObject, this.worldBoundaries)
                ) {
                    this.state = 'game over';
                }
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
