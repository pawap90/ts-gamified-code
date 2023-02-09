export class Player {
    currentRoomId = 0;
    hp = 100;
    treasureFound = false;

    get alive() {
        return this.hp > 0;
    }
}