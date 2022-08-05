
// This will keep track of each tile's state.
let tiles: { emoji: string, state: string }[] = []; 

// Init game
let processedEmojis = duplicate(['🎃', '🐶', '🐱', '⚔️', '🕹️', '⭐', '👾', '🍄', '🦴', '⛏️']);
processedEmojis = shuffle(processedEmojis);
tiles = createTiles(processedEmojis);
prepareBoard();

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
function createTiles(emojis: string[]): { emoji: string, state: string }[] {
    return emojis.map(e => {
        return {
            emoji: e,
            state: 'idle'
        }
    });
}

/** Add a button for each tile to the board */
function prepareBoard(): void {
    const board = document.getElementById('board');
    if (!board) {
        console.error('Missing board');
        return;
    }

    for (const key in tiles) {
        const tileBtn = document.createElement('button')
        tileBtn.setAttribute('class', 'tile-btn');
        tileBtn.setAttribute('data-tileindex', key); // The index matches the tile position in the array.

        // When the user clicks a tile, we update the state and refresh the board
        tileBtn.onclick = function () {
            updateState(tileBtn);
            refreshBoard();
        };

        board.append(tileBtn);
    }

    refreshBoard();
}

/** Refreshes the board to display the current state */
function refreshBoard(): void {
    const buttons = document.getElementsByClassName('tile-btn');
    for (let i = 0; i < buttons.length; i++) {
        const tileBtn = buttons[i]  as HTMLButtonElement;
        const tileState = getTile(tileBtn);
        
        if (!tileState) break;

        switch (tileState.state) {
            case 'idle':
                tileBtn.innerHTML = '❓';
                break;
            case 'flipped':
                tileBtn.innerHTML = tileState.emoji;
                break;
            case 'cleared':
                tileBtn.innerHTML = tileState.emoji;
                tileBtn.style.backgroundColor = 'green';
                tileBtn.disabled = true;
                break;
        }
    }
}

/** Updates the state of the affected tiles */
function updateState(clickedTileBtn: HTMLButtonElement) {
    const currentTile = getTile(clickedTileBtn);

    if (currentTile && currentTile.state === 'idle') {
        const flippedTiles = tiles.filter(p => p.state == 'flipped');
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
}

/** Gets the tile related to a tile button */
function getTile(tileBtn: HTMLButtonElement) {
    const tileIndex = tileBtn.dataset.tileindex;
    if (!tileIndex) {
        console.error('Tile not found');
        return;
    }

    const tile = tiles[parseInt(tileIndex)];
    return tile;
}