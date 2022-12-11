import { initialize as initializeFish, getRandomFish, Fish, add } from "./fish";

initializeFish();

const btnFish = document.getElementById('btn-fish')!;

btnFish.onclick = () => {
  let fish: Fish | null = getRandomFish();

  if (fish)
    add(fish);

  alert(`You caught ${fish?.icon ?? 'nothing 🌊'}`);
}