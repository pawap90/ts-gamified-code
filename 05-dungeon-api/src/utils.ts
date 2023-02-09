function getRandomNumber(min: number, max: number): number {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

function getRandomItem<T>(array: T[]): T {
    const randomItem = array[Math.floor(Math.random() * array.length)];
    return randomItem;
}

export const Utils = {
    getRandomItem,
    getRandomNumber
}