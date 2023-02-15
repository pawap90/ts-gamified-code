import { EmptyRoom, Room, SpikesRoom, TreasureRoom } from './room';
import { Utils } from './utils';

export class Dungeon {
    private numberOfRooms: number;
    rooms: Room[] = [];

    constructor() {
        this.numberOfRooms = Utils.getRandomNumber(7, 13);
    }

    getRoom(id: number): Room | undefined {
        return this.rooms.find(r => r.id == id);
    }

    createRooms(): void {
        this.createRandomRooms();
        this.rooms = this.connectRooms(this.rooms);
    }

    private connectRooms(rooms: Room[]): Room[] {
        if (rooms.length < 2)
            return rooms;

        const root = rooms[0];
        const splitAt = rooms.length / 2 + 1;
        const leftSide = rooms.slice(1, splitAt);
        const rightSide = rooms.slice(splitAt);

        if (leftSide.length > 0)
            root.connect(leftSide[0]);

        if (rightSide.length > 0)
            root.connect(rightSide[0]);

        return [root]
            .concat(this.connectRooms(leftSide))
            .concat(this.connectRooms(rightSide));
    }

    private createRandomRooms(): void {
        // First room is always empty.
        this.rooms.push(new EmptyRoom(0));

        const distributedRoomTypes = [...Array(7).fill('empty'), ...Array(3).fill('spikes')];
        for (let i = 1; i < this.numberOfRooms; i++) {
            const randomRoomType = Utils.getRandomItem(distributedRoomTypes);

            switch (randomRoomType) {
                case 'empty':
                    this.rooms.push(new EmptyRoom(i));
                    break;
                case 'spikes':
                    this.rooms.push(new SpikesRoom(i));
                    break;
            }
        }
        // Pick a random room for the treasure.
        const treasureRoomId = Utils.getRandomNumber(1, this.rooms.length - 1);
        this.rooms[treasureRoomId] = new TreasureRoom(treasureRoomId);
    }
}