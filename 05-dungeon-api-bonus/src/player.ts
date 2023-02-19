import { Character } from './character';

export class Player extends Character {
    currentRoomId = 0;
    treasureFound = false;

    constructor() {
        super('Hero', 20);
    }

    describe(): string {
        return `Player Stats: HP = ${this.hp} | Damage = ${this.damage} | Current room ID = ${this.currentRoomId}`;
    }
}