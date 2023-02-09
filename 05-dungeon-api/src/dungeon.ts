import { EmptyRoom, Room, SpikesRoom, TreasureRoom } from "./room";
import { Utils } from "./utils";

const directions = ['N', 'E', 'S', 'W'] as const;
type Direction = (typeof directions)[number];

export class Dungeon {
    private numberOfRooms: number;
    rooms: Room[] = [];

    constructor(numberOfRooms: number) {
        this.numberOfRooms = numberOfRooms;
    }

    createRooms() {
        this.createRandomRooms();

        for (const room of this.rooms) {
            const availableRooms = this.rooms.filter(r => r.id != room.id && r.doors.length < 4);
            let nextRoomIndex = 0;

            while (room.doors.length < room.maxDoors && nextRoomIndex < availableRooms.length) {

                const otherRoom = availableRooms[nextRoomIndex]!;
                if (otherRoom.id != room.id && !room.doors.find(r => r.roomId == otherRoom.id)) {
                    if (otherRoom.doors.length < otherRoom.maxDoors) {
                        room.doors.push({ roomId: otherRoom.id, direction: this.getRandomDirection(room) });
                        otherRoom.doors.push({ roomId: room.id, direction: this.getRandomDirection(otherRoom) });
                    }
                }
                nextRoomIndex++;
            }
        }
    }

    private getRandomDirection(room: Room): Direction {
        if (room.doors.length == 4)
            throw Error(`No availabe directions left for room ${room.id}`);

        let usedDirections = room.doors.map(d => d.direction);
        let availableDirections = directions.filter(d => usedDirections.indexOf(d) < 0);

        if (availableDirections.length == 1)
            return availableDirections[0];

        const randomDirection = Utils.getRandomItem(availableDirections);
        return randomDirection;
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



