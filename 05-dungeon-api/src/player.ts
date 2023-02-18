import { Character } from './character';

export class Player extends Character {
    currentRoomId = 0;
    treasureFound = false;

    constructor() {
        super('Hero', 20);
    }
}