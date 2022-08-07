function updateState(x: number, y: number) {
    const pixelToUpdate = pixels.find(p => p.x == x && p.y == y);
    if (pixelToUpdate)
        pixelToUpdate.active = !pixelToUpdate.active;
}

function createCanvas(): void {
    const canvasSize = 8;
    const canvas = document.getElementById('canvas');

    for (let x = 0; x < canvasSize; x++) {
        const row = createRow();
        for (let y = 0; y < canvasSize; y++) {
            pixels.push({ x: x, y: y, active: false });
            const pixelBtn = createPixel({ x: x, y: y, active: false });
            row.append(pixelBtn);
        }
        canvas?.append(row);
    }
}

function createRow(): HTMLDivElement {
    const row = document.createElement('div');
    row.setAttribute('class', 'row');

    return row;
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
    for (const key in pixels) {
        const pixel = pixels[key];
        const pixelBtn = document.getElementById(`${pixel.x}-${pixel.y}`);
        if (pixelBtn)
            pixelBtn.style.backgroundColor = pixel.active ? '#28bb84' : '#efefe1';
    }
}

// Start app.
let pixels: { x: number, y: number, active: boolean }[] = [];
createCanvas();