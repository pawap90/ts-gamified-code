import { EmptyRoom, Room, SpikesRoom, TreasureRoom } from './room';
import { Utils } from './utils';

export class Dungeon {
    private rooms: Room[] = [];
    get firstRoom(): Room {
        return this.rooms[0];
    }

    private constructor(rooms: Room[]) {
        this.rooms = rooms;
    }

    static createRandom(): Dungeon {
        const numberOfRooms = Utils.getRandomNumber(7, 13);
        const rooms = this.createRandomRooms(numberOfRooms);
        const connectedRooms = this.connectRooms(rooms);
        return new Dungeon(connectedRooms);
    }

    getRoom(id: number): Room | undefined {
        return this.rooms.find(r => r.id == id);
    }

    private static connectRooms(rooms: Room[]): Room[] {
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

    private static createRandomRooms(numberOfRooms: number): Room[] {
        // First room is always empty.
        const rooms = [new EmptyRoom(0)];

        const distributedRoomTypes = [...Array(7).fill('empty'), ...Array(3).fill('spikes')];
        for (let i = 1; i < numberOfRooms; i++) {
            const randomRoomType = Utils.getRandomItem(distributedRoomTypes);

            switch (randomRoomType) {
                case 'empty':
                    rooms.push(new EmptyRoom(i));
                    break;
                case 'spikes':
                    rooms.push(new SpikesRoom(i));
                    break;
            }
        }
        // Pick a random room for the treasure.
        const treasureRoomId = Utils.getRandomNumber(1, rooms.length - 1);
        rooms[treasureRoomId] = new TreasureRoom(treasureRoomId);

        return rooms;
    }
}