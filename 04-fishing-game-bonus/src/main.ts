import { BaitManager } from "./bait";
import { initialize as initializeFish, getRandomFish, Fish, add } from "./fish";
import Wallet from "./wallet";

type State = 'fishing' | 'shopping';
let currentState: State = 'shopping';

const baitManager = new BaitManager();
baitManager.initialize();

initializeFish();

Wallet.update();

const title = document.getElementById('title')!;
const navGoFishing = document.getElementById('nav-go-fishing')!;
const navGoShopping = document.getElementById('nav-go-shopping')!;
const btnFish = document.getElementById('btn-fish')!;
const imgState = document.getElementById('img-section')! as HTMLImageElement;

updateState();

navGoFishing.onclick = () => {
    currentState = 'fishing';
    updateState();
}

navGoShopping.onclick = () => {
    currentState = 'shopping';
    updateState();
}

btnFish.onclick = () => {
    const usedBait = baitManager.useSelected();
    if (usedBait) {
        let fish: Fish | null = null;
        for (let attempt = 0; attempt < usedBait.luck; attempt++) {
            const auxFish = getRandomFish();

            if ((auxFish && !fish) || (auxFish && fish && auxFish.value > fish.value)) {
                // Keep higher value fish.
                fish = auxFish;
            }
        }

        if (fish) add(fish);

        alert(`You caught ${fish?.icon ?? 'nothing 🌊'}`);
    }
}

function updateState(): void {
    switch (currentState) {
        case 'fishing':
            btnFish.style.visibility = 'visible';
            navGoShopping.style.display = 'block';
            navGoFishing.style.display = 'none';
            baitManager.enableButtons('select');
            imgState.src = "lake.png";
            title.textContent = '🎣 Fishing'

            break;
        case 'shopping':
            btnFish.style.visibility = 'hidden';
            navGoFishing.style.display = 'block';
            navGoShopping.style.display = 'none';
            baitManager.enableButtons('buy');
            imgState.src = "market.png";
            title.textContent = '🛒 Market'

            break;
    }

}