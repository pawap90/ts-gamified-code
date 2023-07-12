import type { GameObject } from './game';

export type SnakeChunk = GameObject & {
    name: 'snake-chunk';
};

export type Snake = {
    direction: Direction;
    chunks: SnakeChunk[];
    get head(): SnakeChunk;
};

type Direction = 'up' | 'down' | 'left' | 'right';

export function createSnake(x: number, y: number, direction: Direction): Snake {
    const chunks = [createChunk(x, y)];
    return {
        chunks,
        direction,
        get head() {
            return this.chunks[0];
        }
    };
}

function createChunk(x: number, y: number): SnakeChunk {
    return { x, y, name: 'snake-chunk' };
}
