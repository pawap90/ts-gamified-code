const pixels: { x: number, y: number, active: boolean }[] = [];

function updateState(x: number, y: number) {
    const pixelToUpdate = pixels.find(p => p.x == x && p.y == y);
    if (pixelToUpdate)
        pixelToUpdate.active = !pixelToUpdate.active;
}

function createGrid(): void {
    const gridSize = 8;
    const grid = document.getElementById('grid');

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            pixels.push({ x: x, y: y, active: false });
            const pixelBtn = createPixel({ x: x, y: y, active: false });
            grid?.append(pixelBtn);
        }
    }
}

function createPixel(pixel: { x: number, y: number, active: boolean }): HTMLButtonElement {
    const pixelBtn = document.createElement('button');
    pixelBtn.id = `${pixel.x}-${pixel.y}`;

    pixelBtn.onclick = function () {
        updateState(pixel.x, pixel.y);
        refreshGrid();
    };

    return pixelBtn;
}

function refreshGrid(): void {
    for (const key in pixels) {
        const pixel = pixels[key];
        const pixelBtn = document.getElementById(`${pixel.x}-${pixel.y}`);
        if (pixelBtn)
            pixelBtn.style.backgroundColor = pixel.active ? '#28bb84' : '#efefe1';
    }
}

// Start app.
createGrid();