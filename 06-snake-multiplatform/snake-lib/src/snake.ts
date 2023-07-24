import type { GameObject, WorldBoundaries } from './game';

export type SnakeChunk = GameObject & {
    name: 'snake-chunk';
    next?: SnakeChunk;
};

type Direction = 'up' | 'down' | 'left' | 'right';

export type SnakeHead = SnakeChunk & { direction: Direction };

export function createSnakeHead(x: number, y: number, direction: Direction): SnakeHead {
    return { ...createChunk(x, y), direction };
}

function createChunk(x: number, y: number): SnakeChunk {
    return { x, y, name: 'snake-chunk' };
}

export function updateSnakePosition(head: SnakeHead): void {
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

export function addChunk(head: SnakeChunk): SnakeChunk {
    let current = head;
    while (current.next) {
        current = current.next;
    }

    current.next = createChunk(current.x, current.y);
    return current.next;
}

export function isSnakeChunk(object: GameObject): object is SnakeChunk {
    return (object as SnakeChunk).name == 'snake-chunk';
}

export function isSnakeHead(object: GameObject): object is SnakeHead {
    return isSnakeChunk(object) && (object as SnakeHead).direction != undefined;
}

export function crashedWithItself(head: SnakeHead): boolean {
    let current = head.next;
    while (current) {
        if (head.x == current.x && head.y == current.y) {
            return true;
        }
        current = current.next;
    }
    return false;
}

export function crashedWithWorld(head: SnakeHead, world: WorldBoundaries): boolean {
    return (
        head.x < world.left ||
        head.x > world.right ||
        head.y < world.top ||
        head.y > world.bottom
    );
}
