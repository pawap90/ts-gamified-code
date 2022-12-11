import { initialize as initializeFish, getRandomFish, add } from "./fish";

initializeFish();

const btnFish = document.getElementById('btn-fish')!;

btnFish.onclick = () => {
  let fish = getRandomFish();

  if (fish)
    add(fish);

  alert(`You caught ${fish?.icon ?? 'nothing 🌊'}`);
}