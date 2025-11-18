import * as readlineSync from 'readline-sync';

const STATE_UP = 'up';
const STATE_DOWN = 'down';
const STATE_CLEARED = 'cleared';

type Tile = {
    emoji: string;
    state: string;
    index: number;
}

class Game {
    readonly tiles: Tile[];

    constructor(emojis: string[]) {
        this.tiles = this.createTiles(emojis);
    }

    /** Create tile array from emoji array */
    createTiles(emojis: string[]): Tile[] {
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

    flip(tileIndex: number): void {
        // If the tile is already flipped or cleared, don't do anything.
        if (this.tiles.find(ft => ft.index == tileIndex && ft.state != STATE_DOWN))
            return;

        const flippedTiles = this.tiles.filter(t => t.state == STATE_UP);
        const selectedTile = this.tiles[tileIndex];

        if (!selectedTile)
            throw new Error('Invalid tile index');
        selectedTile.state = STATE_UP;

        if (flippedTiles.length === 2 && flippedTiles[0] && flippedTiles[1]) {
            // If 2 tiles are already flipped, face them back down.
            flippedTiles[0].state = STATE_DOWN;
            flippedTiles[1].state = STATE_DOWN;
        }
        else if (flippedTiles.length == 1 && flippedTiles[0] && flippedTiles[0].emoji == selectedTile.emoji) {
            // If 1 tile is flipped and it matches, clear them both.
            flippedTiles[0].state = STATE_CLEARED;
            selectedTile.state = STATE_CLEARED;
        }
    }

    printTiles(): void {
        console.clear();
        const gridSize = 4;

        for (var i = 0; i < this.tiles.length; i = i + gridSize) {
            const row = this.tiles.slice(i, i + gridSize)
                .map(tile => {
                    if (tile.state == STATE_DOWN)
                        return tile.index.toString().padStart(2, ' ');
                    else
                        return tile.emoji;
                })
                .join('  |  ');

            console.log(row);
        }
    }

    run() {
        this.printTiles();
        readlineSync.question('Press Enter to start.');

        this.tiles.forEach(t => t.state = STATE_DOWN);
        this.printTiles();

        while (this.tiles.findIndex(t => t.state == STATE_DOWN) > -1) {
            let inputNumber = readlineSync.questionInt("Enter a tile's number: ");
            if (inputNumber >= 0 && inputNumber < 16) {
                this.flip(inputNumber);
                this.printTiles();
            }
            else console.log('Invalid input');
        }
        console.log('Game completed. Congrats!');
    }
}

// Now our state is handled by this instance.
const game = new Game(['🎃', '🐶', '🐱', '🎮', '⭐', '👾', '🍄', '🦴']);
game.run();