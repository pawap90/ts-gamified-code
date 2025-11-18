import * as readlineSync from 'readline-sync';

const STATE_UP = 'up';
const STATE_DOWN = 'down';
const STATE_CLEARED = 'cleared';

type Tile = {
    emoji: string;
    state: string;
    index: number;
}

// This will keep track of each tile's state.
let tiles: Tile[] = [];

/** Create tile array from emoji array */
function createTiles(emojis: string[]): Tile[] {
    const duplicatedEmojis = [...emojis, ...emojis];

    const shuffledEmojis = duplicatedEmojis;
    for (let i = 0; i < shuffledEmojis.length; i++) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const currentEmoji = shuffledEmojis[i];

        // TypeScript requires us to check these might be undefined, even though they can't be
        // We'll see better ways to handle this in future levels.
        if (!shuffledEmojis[randomIndex] || !currentEmoji) 
            throw new Error('Unexpected error during shuffling. Index out of bounds.'); 

        // Swap [i] value with [randomIndex] value.
        shuffledEmojis[i] = shuffledEmojis[randomIndex];
        shuffledEmojis[randomIndex] = currentEmoji;
    }

    return shuffledEmojis.map((e, index): Tile => ({
        emoji: e,
        state: STATE_UP,
        index
    }));
}

function flip(tileIndex: number): void {
    // If the tile is already flipped or cleared, don't do anything.
    if (tiles.find(ft => ft.index === tileIndex && ft.state !== STATE_DOWN))
        return;

    const flippedTiles = tiles.filter(t => t.state === STATE_UP);
    const selectedTile = tiles[tileIndex];
    if (!selectedTile) 
        throw new Error('Invalid tile index');

    selectedTile.state = STATE_UP;

    if (flippedTiles.length === 2 && flippedTiles[0] && flippedTiles[1]) {
        // If 2 tiles are already flipped, face them back down.
        flippedTiles[0].state = STATE_DOWN;
        flippedTiles[1].state = STATE_DOWN;
    }
    else if (flippedTiles.length === 1 && flippedTiles[0] && flippedTiles[0].emoji === selectedTile.emoji) {
        // If 1 tile is flipped and it matches, clear them both.
        flippedTiles[0].state = STATE_CLEARED;
        selectedTile.state = STATE_CLEARED;
    }
}

function printTiles(): void {
    console.clear();
    const gridSize = 4;

    for (let i = 0; i < tiles.length; i += gridSize) {
        const row = tiles.slice(i, i + gridSize)
            .map(tile => 
                tile.state === STATE_DOWN
                    ? tile.index.toString().padStart(2, ' ')
                    : tile.emoji
            )
            .join('  |  ');

        console.log(row);
    }
}

function runGame() {
    printTiles();
    readlineSync.question('Press Enter to start.');

    tiles.forEach(t => t.state = STATE_DOWN);
    printTiles();

    while (tiles.findIndex(t => t.state === STATE_DOWN) > -1) {
        const inputNumber = readlineSync.questionInt("Enter a tile's number: ");
        if (inputNumber >= 0 && inputNumber < tiles.length) {
            flip(inputNumber);
            printTiles();
        }
        else console.log('Invalid input');
    }
    console.log('Game completed. Congrats!');
}

tiles = createTiles(['🎃', '🐶', '🐱', '🎮', '⭐', '👾', '🍄', '🦴']); // Set the initial state.
runGame();