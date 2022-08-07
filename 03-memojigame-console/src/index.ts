import * as readlineSync from 'readline-sync';

type Tile = {
    emoji: string,
    state: string,
    index: number
}

// This will keep track of each tile's state.
let tiles: Tile[] = [];

/** Duplicate the initial emoji array (each tile has a pair) */
function duplicate(emojis: string[]): string[] {
    return [...emojis, ...emojis];
}

/** Shuffle emoji array so the tiles appear in different orders each time */
function shuffle(emojis: string[]): string[] {
    for (let i = 0; i < emojis.length; i++) {
        const tile = emojis[i];
        const randomNewPosition = Math.floor(Math.random() * emojis.length);

        // Swap the current tile for the one in the new position.
        emojis[i] = emojis[randomNewPosition]
        emojis[randomNewPosition] = tile;
    }

    return emojis;
}

/** Create tile array from emoji array */
function createTiles(emojis: string[]): Tile[] {
    return emojis.map((e, index) => {
        return {
            emoji: e,
            state: 'idle',
            index
        }
    });
}

function flip(tileIndex: number) {
    const currentTile = tiles[tileIndex];
    const flippedTiles = tiles.filter(t => t.state == 'flipped');

    // If the tile is already flipped, don't do anything.
    if (flippedTiles.find(ft => ft.index == tileIndex))
        return;

    if (flippedTiles.length == 2) {
        flippedTiles[0].state = 'idle';
        flippedTiles[1].state = 'idle';
        currentTile.state = 'flipped';
    }
    else if (flippedTiles.length == 1 && flippedTiles[0].emoji == currentTile.emoji) {
        flippedTiles[0].state = 'cleared';
        currentTile.state = 'cleared';
    }
    else {
        currentTile.state = 'flipped';
    }
}

function getTileCharacterByState(tile: Tile): string {
    switch (tile.state) {
        case 'idle': return tile.index.toString().padStart(2, ' ');              // Use this as example of dangers of inference?
        case 'flipped': return tile.emoji;
        case 'cleared': return '✅';
        default: return 'Wrong state';
    }
}

function printTiles(): void {
    console.clear();

    let row = '';
    let tilesClone = tiles.slice(0);

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        row = tilesClone.splice(0, 4)
            .map(t => getTileCharacterByState(t))
            .join('  |  ');

        console.log(row);
        row = '';
    }
}

function runGame() {
    printTiles();

    let gameOver = false;
    while (!gameOver) {

        let inputNumber = readlineSync.questionInt("Enter a tile's number to flip it: ", { min: 0, max: tiles.length });
        flip(inputNumber);
        printTiles();
    }
}

// Init game
let processedEmojis = duplicate(['🎃', '🐶', '🐱', '🕹️', '⭐', '👾', '🍄', '🦴']);
processedEmojis = shuffle(processedEmojis);
tiles = createTiles(processedEmojis); // Set the initial state.

runGame();