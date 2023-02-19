import { EmptyRoom, EnemyRoom, EpicSwordRoom, HealingPotionRoom, Room, SpikesRoom, TreasureRoom } from './room';
import { Utils } from './utils';

export class Dungeon {
    private rooms: Room[] = [];
    get firstRoom(): Room {
        return this.rooms[0];
    }

    private constructor(rooms: Room[]) {
        this.rooms = rooms;
    }

    getRoom(id: number): Room | undefined {
        return this.rooms.find(r => r.id == id);
    }

    static createRandom(): Dungeon {
        const numberOfRooms = Utils.getRandomNumber(7, 13);
        const rooms = this.createRandomRooms(numberOfRooms);
        const connectedRooms = this.connectRooms(rooms);
        return new Dungeon(connectedRooms);
    }

    static createEasyMode(): Dungeon {
        const firstRoom = new EmptyRoom(0);
        const treasureRoom = new TreasureRoom(1);
        firstRoom.connect(treasureRoom);

        return new Dungeon([ firstRoom, treasureRoom ]);
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

        const distributedRoomTypes = [
            ...Array<string>(2).fill('empty'),
            ...Array<string>(3).fill('healing-potion'),
            ...Array<string>(2).fill('spikes'),
            ...Array<string>(3).fill('enemy')];
        for (let i = 1; i < numberOfRooms; i++) {
            const randomRoomType = Utils.getRandomItem(distributedRoomTypes);

            switch (randomRoomType) {
                case 'empty':
                    rooms.push(new EmptyRoom(i));
                    break;
                case 'spikes':
                    rooms.push(new SpikesRoom(i));
                    break;
                case 'enemy':
                    rooms.push(new EnemyRoom(i));
                    break;
                case 'healing-potion':
                    rooms.push(new HealingPotionRoom(i));
                    break;
            }
        }
        // Pick a random room for the sword and treasure.
        const swordRoomId = Utils.getRandomNumber(1, rooms.length - 1);
        rooms[swordRoomId] = new EpicSwordRoom(swordRoomId);

        // The treasure can override any existent room except the first one.
        const treasureRoomId = Utils.getRandomNumber(1, rooms.length - 1);
        rooms[treasureRoomId] = new TreasureRoom(treasureRoomId);

        return rooms;
    }
}