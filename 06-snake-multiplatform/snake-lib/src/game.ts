import { isSnakeHead, updateSnakePosition } from './snake';

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

        for (const gameObject of this.gameObjects) {
            // Check if snake crashed.
            // Check if snake ate food.
            // Move snake.
            if (isSnakeHead(gameObject)) {
                updateSnakePosition(gameObject);
            }
        }

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
