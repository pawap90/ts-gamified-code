import { Character } from './character';
import { Player } from './player';

export abstract class Enemy extends Character {
    constructor(name: string, damage: number) {
        super(name, damage);
    }

    abstract describe(): string;

    fight(player: Player): void {
        while (player.alive && this.alive) {
            player.attack(this);
            this.attack(player);
        }
    }
}

export class Rat extends Enemy {
    constructor() {
        super('Rat', 8);
    }

    override describe(): string {
        return 'Oh no! A rat!';
    }
}

export class Bandit extends Enemy {
    constructor() {
        super('Bandit', 10);
    }

    override describe(): string {
        return 'A dangerous bandit approaches!';
    }
}

export class Troll extends Enemy {
    constructor() {
        super('Troll', 15);
    }

    override describe(): string {
        return 'Watch out! A fearsome troll is coming!';
    }
}