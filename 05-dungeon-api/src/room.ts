import { Player } from "./player";
import { Utils } from "./utils";

const directions = ['N', 'E', 'S', 'W'] as const;
type Direction = (typeof directions)[number];

export class Room {
    id: number;
    maxDoors: number;
    doors: { roomId: number; direction: "N" | "S" | "E" | "W"; }[];

    constructor(id: number, maxDoors: number) {
        this.id = id;
        this.maxDoors = maxDoors;
        this.doors = [];
    }

    getRoomId(doorDirection: 'N' | 'S' | 'E' | 'W'): number | undefined {
        const door = this.doors.find(d => d.direction == doorDirection);
        return door?.roomId;
    }

    enter(player: Player): string {
        player.currentRoomId = this.id;
        let message = `You see ${this.doors.length} ${this.doors.length > 1 ? 'doors' : 'door'} located `;

        if (this.doors.length == 1) {
            message += this.doors[0].direction;
        }
        else if (this.doors.length == 2) {
            message += `${this.doors[0].direction} and ${this.doors[1].direction}`;
        }
        else {
            let doors = this.doors.slice(0, this.doors.length - 1).map(d => d.direction).join(', ');
            doors += `, and ${this.doors[this.doors.length - 1].direction}`;
            message += doors;
        }

        message += '.';

        return message;
    }

    connect(room: Room) {
        const dir = this.getRandomDirection();
        this.doors.push({ roomId: room.id, direction: dir });
        room.doors.push({ roomId: this.id, direction: this.getOppositeDirection(dir) });
    }

    private getRandomDirection(): Direction {
        if (this.doors.length == 4)
            throw Error(`No availabe directions left for room ${this.id}`);

        let usedDirections = this.doors.map(d => d.direction);
        let availableDirections = directions.filter(d => usedDirections.indexOf(d) < 0);

        if (availableDirections.length == 1)
            return availableDirections[0];

        const randomDirection = Utils.getRandomItem(availableDirections);
        return randomDirection;
    }

    private getOppositeDirection(direction: Direction): Direction {
        switch (direction) {
            case 'N': return 'S';
            case 'S': return 'N';
            case 'E': return 'W';
            case 'W': return 'E';
        }
    }
}

export class EmptyRoom extends Room {
    enter(player: Player): string {
        let message = 'The room is empty. ';
        message += super.enter(player);
        return message;
    }
}

export class SpikesRoom extends Room {
    damage: number;

    constructor(id: number, maxDoors: number) {
        super(id, maxDoors);
        this.damage = Utils.getRandomItem([10, 20, 50, 100]);
    }

    enter(player: Player): string {
        player.hp -= this.damage;
        let message = `Oh no! Spikes! You lost ${this.damage} HP points!`;
        message += super.enter(player);
        return message;
    }
}

export class TreasureRoom extends Room {
    enter(player: Player): string {
        super.enter(player);

        let message = 'Congratulations! You found the treasure!';
        player.treasureFound = true;
        return message;
    }
}