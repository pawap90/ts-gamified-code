
const STATE_IDLE = 'idle';
const STATE_FLIPPED = 'flipped';
const STATE_CLEARED = 'cleared';

// This will keep track of each tile's state.
let tiles: { emoji: string, state: string }[] = [];

// Init game
let processedEmojis = duplicate(['🎃', '🐶', '🐱', '⚔️', '🕹️', '⭐', '👾', '🍄', '🦴', '⛏️']);
processedEmojis = shuffle(processedEmojis);
tiles = createTiles(processedEmojis); // Set the initial state.
prepareBoard();

/** Duplicate the initial emoji array (each tile has a pair) */
function duplicate(emojis: string[]): string[] {
    return [...emojis, ...emojis];
}

/** Shuffle emoji array so the tiles appear in different orders each time */
function shuffle(emojis: string[]): string[] {
    for (let i = 0; i < emojis.length; i++) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const currentEmoji = emojis[i];

        // TypeScript requires us to check these might be undefined, even though they can't be
        // We'll see better ways to handle this in future levels.
        if (!emojis[randomIndex] || !currentEmoji)
            throw new Error('Unexpected error during shuffling. Index out of bounds.');

        // Swap [i] value with [randomIndex] value.
        emojis[i] = emojis[randomIndex];
        emojis[randomIndex] = currentEmoji;
    }

    return emojis;
}

/** Create tile array from emoji array */
function createTiles(emojis: string[]): { emoji: string, state: string }[] {
    return emojis.map(e => ({
        emoji: e,
        state: STATE_IDLE
    }));
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
        const tileBtn = buttons[i] as HTMLButtonElement;
        const tileState = getTile(tileBtn);

        if (!tileState) break;

        switch (tileState.state) {
            case STATE_IDLE:
                tileBtn.innerHTML = '❓';
                break;
            case STATE_FLIPPED:
                tileBtn.innerHTML = tileState.emoji;
                break;
            case STATE_CLEARED:
                tileBtn.innerHTML = tileState.emoji;
                tileBtn.style.backgroundColor = '#90ee90'; 
                tileBtn.disabled = true;
                break;
        }
    }
}

/** Updates the state of the affected tiles */
function updateState(clickedTileBtn: HTMLButtonElement) {
    const currentTile = getTile(clickedTileBtn);

    if (currentTile && currentTile.state === STATE_IDLE) {
        const flippedTiles = tiles.filter(p => p.state === STATE_FLIPPED);
        if (flippedTiles.length === 2 && flippedTiles[0] && flippedTiles[1]) {
            flippedTiles[0].state = STATE_IDLE;
            flippedTiles[1].state = STATE_IDLE;
            currentTile.state = STATE_FLIPPED;
        }
        else if (flippedTiles.length === 1 && flippedTiles[0] && flippedTiles[0].emoji === currentTile.emoji) {
            flippedTiles[0].state = STATE_CLEARED;
            currentTile.state = STATE_CLEARED;
        }
        else {
            currentTile.state = STATE_FLIPPED;
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