const pixels: { x: number, y: number, colorHex: string }[] = [];
const palette = ['#fcffc0', '#74a33f', '#2a584f', '#6eb8a8', '#c6505a', '#2f142f', '#774448', '#ee9c5d'];
const currentColor: { index: number, hex: string } = { index: 0, hex: palette[0] };

function updateState(x: number, y: number): void {
    const pixelToUpdate = pixels.find(p => p.x == x && p.y == y);
    if (pixelToUpdate)
        pixelToUpdate.colorHex = currentColor.hex;
}

function setNextColor(): void {
    currentColor.index = currentColor.index < palette.length - 1 ? currentColor.index + 1 : 0;
    currentColor.hex = palette[currentColor.index];
}

function createGrid(): void {
    const gridSize = 8;
    const grid = document.getElementById('grid');

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            pixels.push({ x: x, y: y, colorHex: currentColor.hex });
            const pixelBtn = createPixelBtn({ x: x, y: y, active: false });
            grid?.append(pixelBtn);
        }
    }

    setColorButton();
    refreshGrid();
}

function createPixelBtn(pixel: { x: number, y: number, active: boolean }): HTMLButtonElement {
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
            pixelBtn.style.backgroundColor = pixel.colorHex;
    }
}

function setColorButton(): void {
    const colorBtn = document.getElementById('color');

    if (colorBtn) {
        colorBtn.style.backgroundColor = currentColor.hex;

        colorBtn.onclick = function () {
            setNextColor();
            colorBtn.style.backgroundColor = currentColor.hex;
        };
    }
}

// Start app.
createGrid();