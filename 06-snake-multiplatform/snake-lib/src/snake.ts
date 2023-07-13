import type { Direction, GameObject } from './game';

export type SnakeChunk = GameObject & {
    name: 'snake-chunk';
    next?: SnakeChunk;
};

export type SnakeHead = SnakeChunk & { direction: Direction };

export function createSnake(x: number, y: number, direction: Direction): SnakeHead {
    return { ...createChunk(x, y), direction };
}

function createChunk(x: number, y: number): SnakeChunk {
    return { x, y, name: 'snake-chunk' };
}

export function updateSnake(head: SnakeHead): void {
    let previous = { x: head.x, y: head.y };

    // Move the first chunk.
    switch (head.direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Each chunk follows the previous one.
    let current = head.next;
    while (current) {
        const temp = { x: current.x, y: current.y };
        current.x = previous.x;
        current.y = previous.y;
        previous = temp;
        current = current.next;
    }
}
