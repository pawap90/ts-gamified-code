import * as readlineSync from 'readline-sync';

type Tile = {
    emoji: string,
    state: string,
    index: number
}

// This will keep track of each tile's state.
let tiles: Tile[] = [];

/** Create tile array from emoji array */
function createTiles(emojis: string[]): Tile[] {
    const duplicatedEmojis = [...emojis, ...emojis];

    const shuffledEmojis = duplicatedEmojis;
    for (let i = 0; i < shuffledEmojis.length; i++) {
        const randomPos = Math.floor(Math.random() * (i + 1));
        [shuffledEmojis[randomPos], shuffledEmojis[i]] = [shuffledEmojis[i], shuffledEmojis[randomPos]];
    }

    return shuffledEmojis.map((e, index) => {
        return {
            emoji: e,
            state: 'flipped',
            index
        }
    });
}

function flip(tileIndex: number): void {
    // If the tile is already flipped or cleared, don't do anything.
    if (tiles.find(ft => ft.index == tileIndex && ft.state != 'idle'))
        return;

    const flippedTiles = tiles.filter(t => t.state == 'flipped');
    const selectedTile = tiles[tileIndex];
    selectedTile.state = 'flipped';

    if (flippedTiles.length == 2) {
        // If 2 tiles are already flipped, face them back down.
        flippedTiles[0].state = 'idle';
        flippedTiles[1].state = 'idle';
    }
    else if (flippedTiles.length == 1 && flippedTiles[0].emoji == selectedTile.emoji) {
        // If 1 tile is flipped and it matches, clear them both.
        flippedTiles[0].state = 'cleared';
        selectedTile.state = 'cleared';
    }
}

function printTiles(): void {
    console.clear();
    const gridSize = 4;

    for (var i = 0; i < tiles.length; i = i + gridSize) {
        const row = tiles.slice(i, i + gridSize)
            .map(tile => {
                if (tile.state == 'idle')
                    return tile.index.toString().padStart(2, ' ');
                else
                    return tile.emoji;
            })
            .join('  |  ');

        console.log(row);
    }
}

function runGame() {
    printTiles();
    readlineSync.question('Try to memorize the grid. Then, press Enter to continue.');

    tiles.forEach(t => t.state = 'idle');
    printTiles();

    while (tiles.findIndex(t => t.state == 'idle') > -1) {
        let inputNumber = readlineSync.questionInt("Enter a tile's number: ");
        if (inputNumber >= 0 && inputNumber < 16) {
            flip(inputNumber);
            printTiles();
        }
        else console.log('Invalid input')
    }
    console.log('Game completed. Congrats!')
}

tiles = createTiles(['🎃', '🐶', '🐱', '🎮', '⭐', '👾', '🍄', '🦴']); // Set the initial state.
runGame();