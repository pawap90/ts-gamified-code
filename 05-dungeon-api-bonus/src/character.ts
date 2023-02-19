import { Utils } from './utils';

export abstract class Character {
    hp: number;
    damage: number;
    name: string;

    get alive(): boolean {
        return this.hp > 0;
    }

    constructor(name: string, damage: number) {
        this.name = name;
        this.hp = 100;
        this.damage = damage;
    }

    attack(character: Character): void {
        // 0.2 chance to miss.
        if (this.alive && Utils.getRandomNumber(1, 10) > 2) {
            character.hp -= this.damage;
        }
    }
}