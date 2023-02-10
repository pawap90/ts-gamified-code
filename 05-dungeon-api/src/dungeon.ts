import { EmptyRoom, Room, SpikesRoom, TreasureRoom } from "./room";
import { Utils } from "./utils";

export class Dungeon {
    private numberOfRooms: number;
    rooms: Room[] = [];

    constructor(numberOfRooms: number) {
        this.numberOfRooms = numberOfRooms;
    }

    createRooms() {
        this.createRandomRooms();
        this.rooms = this.connectRooms(this.rooms);
    }

    private connectRooms(_rooms: Room[]): Room[] {
        if (_rooms.length < 2)
            return _rooms;
    
        const root = _rooms[0];
        const splitAt = _rooms.length / 2;
        const sideA = _rooms.slice(1, splitAt);
        const sideB = _rooms.slice(splitAt);
    
        if (sideA.length > 0) 
            root.connect(sideA[0]);
    
        if (sideB.length > 0) 
            root.connect(sideB[0]);
    
        const connectedA = this.connectRooms(sideA);
        const connectedB = this.connectRooms(sideB);
    
        return [root].concat(connectedA).concat(connectedB);
    }

    getRoom(id: number): Room | undefined {
        return this.rooms.find(r => r.id == id);
    }

    private createRandomRooms() {
        // First room is always empty.
        this.rooms.push(new EmptyRoom(0, Utils.getRandomNumber(1, 4)));

        const distributedRoomTypes = [...Array(7).fill('empty'), ...Array(3).fill('spikes')];
        for (var i = 1; i < this.numberOfRooms; i++) {
            const numDoors = Utils.getRandomNumber(1, 4);
            const randomRoomType = Utils.getRandomItem(distributedRoomTypes)

            switch (randomRoomType) {
                case 'empty':
                    this.rooms.push(new EmptyRoom(i, numDoors));
                    break;
                case 'spikes':
                    this.rooms.push(new SpikesRoom(i, numDoors));
                    break;
            }
        }
        // Pick a random room for the treasure.
        const treasureRoomId = Utils.getRandomNumber(1, this.rooms.length - 1);
        this.rooms[treasureRoomId] = new TreasureRoom(treasureRoomId, Utils.getRandomNumber(1, 4));
    }
}



