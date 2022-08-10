const pixels: { x: number, y: number, colorHex: string }[] = [];
const palette = ['#fcffc0', '#74a33f', '#2a584f', '#6eb8a8', '#c6505a', '#2f142f', '#774448', '#ee9c5d'];
const currentColor = { index: 0, hex: palette[0] };

function updateState(x: number, y: number): void {
    const pixelToUpdate = pixels.find(p => p.x == x && p.y == y);
    if (pixelToUpdate)
        pixelToUpdate.colorHex = currentColor.hex;
}

function setNextColor(): void {
    currentColor.index = currentColor.index < palette.length - 1 ? currentColor.index + 1 : 0;
    currentColor.hex = palette[currentColor.index];
}

function createCanvas(): void {
    const canvasSize = 8;
    const canvas = document.getElementById('canvas');

    for (let x = 0; x < canvasSize; x++) {
        for (let y = 0; y < canvasSize; y++) {
            pixels.push({ x: x, y: y, colorHex: currentColor.hex });
            const pixelBtn = createPixelBtn({ x: x, y: y, active: false });
            canvas?.append(pixelBtn);
        }
    }

    refreshCanvas(); // Initialize with first color in the palette.
    setNextColor(); // So the user starts with a different color.
    initializeColorBtn();
}

function createPixelBtn(pixel: { x: number, y: number, active: boolean }): HTMLButtonElement {
    const pixelBtn = document.createElement('button');
    pixelBtn.id = `${pixel.x}-${pixel.y}`;

    pixelBtn.onclick = function () {
        updateState(pixel.x, pixel.y);
        refreshCanvas();
    };

    return pixelBtn;
}

function refreshCanvas(): void {
    for (const key in pixels) {
        const pixel = pixels[key];
        const pixelBtn = document.getElementById(`${pixel.x}-${pixel.y}`);
        if (pixelBtn)
            pixelBtn.style.backgroundColor = pixel.colorHex;
    }
}

function initializeColorBtn(): void {
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
createCanvas();