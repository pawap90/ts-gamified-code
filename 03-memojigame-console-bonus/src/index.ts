import * as readlineSync from 'readline-sync';

type Tile = {
    emoji: string,
    state: string,
    index: number
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
            const randomPos = Math.floor(Math.random() * (i + 1));
            const currentEmoji = shuffledEmojis[i];
            // Swap [i] value with [randomPos] value.
            shuffledEmojis[i] = shuffledEmojis[randomPos];
            shuffledEmojis[randomPos] = currentEmoji;
        }

        return shuffledEmojis.map((e, index) => {
            return {
                emoji: e,
                state: 'up',
                index
            }
        });
    }

    flip(tileIndex: number): void {
        // If the tile is already flipped or cleared, don't do anything.
        if (this.tiles.find(ft => ft.index == tileIndex && ft.state != 'down'))
            return;

        const flippedTiles = this.tiles.filter(t => t.state == 'up');
        const selectedTile = this.tiles[tileIndex];
        selectedTile.state = 'up';

        if (flippedTiles.length == 2) {
            // If 2 tiles are already flipped, face them back down.
            flippedTiles[0].state = 'down';
            flippedTiles[1].state = 'down';
        }
        else if (flippedTiles.length == 1 && flippedTiles[0].emoji == selectedTile.emoji) {
            // If 1 tile is flipped and it matches, clear them both.
            flippedTiles[0].state = 'cleared';
            selectedTile.state = 'cleared';
        }
    }

    printTiles(): void {
        console.clear();
        const gridSize = 4;

        for (var i = 0; i < this.tiles.length; i = i + gridSize) {
            const row = this.tiles.slice(i, i + gridSize)
                .map(tile => {
                    if (tile.state == 'down')
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

        this.tiles.forEach(t => t.state = 'down');
        this.printTiles();

        while (this.tiles.findIndex(t => t.state == 'down') > -1) {
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