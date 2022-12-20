import Wallet from "./wallet";

export type Bait = {
    name: string,
    icon: string,
    amount: number,
    price: number,
    luck: number
}

export class BaitManager {
    baits: Bait[];
    selectedBait: Bait | undefined;

    constructor() {
        this.baits = [
            { name: 'worm', icon: '🪱', price: 1, amount: 0, luck: 1 },
            { name: 'cricket', icon: '🦗', price: 5, amount: 0, luck: 3 }
        ];
    }

    initialize() {
        const baitsSection = document.getElementById('bait')!;

        for (const bait of this.baits) {
            const container = document.createElement('div');

            const amount = document.createElement('span');
            amount.id = `${bait.name}-amount`;

            const btnBuy = document.createElement('button');
            btnBuy.className = 'buy';
            btnBuy.innerHTML = `Buy  $${bait.price}`;
            btnBuy.style.display = 'block';
            btnBuy.onclick = () => this.buy(bait);

            const btnSelect = document.createElement('button');
            btnSelect.className = 'select';
            btnSelect.innerHTML = 'Select';
            btnSelect.style.display = 'none';
            btnSelect.onclick = () => this.select(bait, btnSelect);

            container.appendChild(amount)
            container.appendChild(btnBuy)
            container.appendChild(btnSelect)
            baitsSection.appendChild(container);
        }

        this.update();
    }

    update() {
        for (const bait of this.baits) {
            const amount = document.getElementById(`${bait.name}-amount`)!;
            amount.innerHTML = `${bait.icon} ${bait.amount}`;
        }
    }

    buy(bait: Bait) {
        if (Wallet.getFunds() - bait.price < 0)
            return;

        bait.amount++;
        Wallet.add(-bait.price);
        this.update();
    }

    select(bait: Bait, button: HTMLButtonElement) {
        const selectButtons = Array.from(document.getElementsByClassName('select')) as HTMLElement[];
        for (const btn of selectButtons) {
            btn.className = 'select';
        }

        this.selectedBait = bait;
        button.className = 'select active';
    }

    enableButtons(mode: 'buy' | 'select') {
        const buyButtons = Array.from(document.getElementsByClassName('buy')) as HTMLElement[];
        const selectButtons = Array.from(document.getElementsByClassName('select')) as HTMLElement[];

        for (const btn of selectButtons) {
            btn.style.display = mode == 'buy' ? 'none' : 'block';
        }

        for (const btn of buyButtons) {
            btn.style.display = mode == 'buy' ? 'block' : 'none';
        }
    }

    useSelected(): Bait | null {
        if (!this.selectedBait) {
            alert('Select a bait!');
            return null;
        }

        if (this.selectedBait.amount == 0) {
            alert(`No more ${this.selectedBait.icon} available.`);
            return null;
        }

        this.selectedBait.amount--;
        this.update();
        return this.selectedBait;
    }
}