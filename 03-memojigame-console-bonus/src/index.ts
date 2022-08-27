import * as readlineSync from 'readline-sync';

type Tile = {
    emoji: string,
    state: string,
    index: number
}

class Game {
    tiles: Tile[];

    constructor(emojis: string[]) {
        this.tiles = this.createTiles(emojis);
    }

    /** Create tile array from emoji array */
    createTiles(emojis: string[]): Tile[] {
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

    flip(tileIndex: number): void {
        // If the tile is already flipped or cleared, don't do anything.
        if (this.tiles.find(ft => ft.index == tileIndex && ft.state != 'idle'))
            return;
    
        const flippedTiles = this.tiles.filter(t => t.state == 'flipped');
        const selectedTile = this.tiles[tileIndex];
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

    printTiles(): void {
        console.clear();
        const gridSize = 4;
    
        for (var i = 0; i < this.tiles.length; i = i + gridSize) {
            const row = this.tiles.slice(i, i + gridSize)
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

    run() {
        this.printTiles();
        readlineSync.question('Try to memorize the grid. Then, press Enter to continue.');
    
        this.tiles.forEach(t => t.state = 'idle');
        this.printTiles();
    
        while (this.tiles.findIndex(t => t.state == 'idle') > -1) {
            let inputNumber = readlineSync.questionInt("Enter a tile's number to flip it: ", { min: 0, max: this.tiles.length - 1 });
            this.flip(inputNumber);
            this.printTiles();
        }
        console.log('Game completed. Congrats!')
    }
}

// Now our state is handled by this instance.
const game = new Game(['🎃', '🐶', '🐱', '🎮', '⭐', '👾', '🍄', '🦴']); 
game.run();