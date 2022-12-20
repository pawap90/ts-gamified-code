import Wallet from "./wallet";

export type Fish = {
    name: string,
    icon: string,
    amount: number,
    value: number,
    probability: number
}

const fishes: Fish[] = [
    { name: 'boot', icon: '🥾', amount: 0, value: 1, probability: 4 },
    { name: 'fish', icon: '🐟', amount: 0, value: 5, probability: 4 },
    { name: 'tropical', icon: '🐠', amount: 0, value: 10, probability: 2 }
]

export function initialize() {
    const fishesSection = document.getElementById('fish')!;

    for (const fish of fishes) {
        const container = document.createElement('div');
        container.className = 'fish-item';

        const amount = document.createElement('span');
        amount.id = `${fish.name}-amount`;
        const price = document.createElement('span');
        price.innerHTML = ` x $${fish.value}`;

        container.appendChild(amount);
        container.appendChild(price);
        fishesSection.appendChild(container);
    }

    const sellAllBtn = document.createElement('button');
    sellAllBtn.innerHTML = 'Sell all';
    sellAllBtn.onclick = sellAll;

    fishesSection.appendChild(sellAllBtn);

    update();
}

export function getRandomFish(): Fish | null {

    // Distribute fish according to their probability.
    const distribution = fishes.map((f, index) => {
        const distributedIndex = [...Array<number | null>(f.probability).fill(index)];
        return distributedIndex;
    });

    const flatDistribution = distribution.flat();

    // Add null for missed attempts.
    const missedAttemptsProbability = distribution.length;
    flatDistribution.push(...Array<number | null>(missedAttemptsProbability).fill(null));

    // Get random fish from distribution.
    const fishIndex = flatDistribution[Math.floor(Math.random() * flatDistribution.length)];

    if (fishIndex != null)
        return fishes[fishIndex];

    return null;
}

export function add(fish: Fish) {
    fish.amount++;
    update();
}

function update() {
    for (const fish of fishes) {
        const amount = document.getElementById(`${fish.name}-amount`)!;
        amount.innerHTML = `${fish.icon} ${fish.amount}`
    }
}

function sellAll() {
    let earnings = 0;
    for (const fish of fishes) {
        earnings += fish.value * fish.amount;
        fish.amount = 0;
    }

    Wallet.add(earnings);
    update();
}

