const pixels: { x: number, y: number, active: boolean }[] = [];

function updateState(x: number, y: number): void {
    const pixelToUpdate = pixels.find(p => p.x == x && p.y == y);
    if (pixelToUpdate)
        pixelToUpdate.active = !pixelToUpdate.active;
}

function createCanvas(): void {
    const canvasSize = 8;
    const canvas = document.getElementById('canvas');

    if (!canvas)
        throw new Error('Canvas element not found');

    for (let x = 0; x < canvasSize; x++) {
        for (let y = 0; y < canvasSize; y++) {
            const pixel = { x: x, y: y, active: false };
            pixels.push(pixel);
            
            const pixelBtn = createPixel(pixel);
            canvas.append(pixelBtn);
        }
    }
}

function createPixel(pixel: { x: number, y: number, active: boolean }): HTMLButtonElement {
    const pixelBtn = document.createElement('button');
    pixelBtn.id = `${pixel.x}-${pixel.y}`;

    pixelBtn.onclick = function () {
        updateState(pixel.x, pixel.y);
        refreshCanvas();
    };

    return pixelBtn;
}

function refreshCanvas(): void {
    for (const pixel of pixels) {
        const pixelBtn = document.getElementById(`${pixel.x}-${pixel.y}`);
        if (pixelBtn)
            pixelBtn.style.backgroundColor = pixel.active ? '#28bb84' : '#efefe1';
    }
}

// Start app.
createCanvas();
