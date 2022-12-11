let funds = 20; // Tracks the player's $.

function update() {
    const wallet = document.getElementById('wallet')!;
    wallet.innerHTML = `💰 $${funds}`;
}

function add(value: number) {
    funds += value;
    update();
}

function getFunds() {
    return funds;
}

const Wallet = {
    update,
    add,
    getFunds
}

export default Wallet;