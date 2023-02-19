import { Player } from './player';
import { Utils } from './utils';

export type Direction = 'North' | 'East' | 'South' | 'West';
const directions: Direction[] = ['North', 'East', 'South', 'West'];

export abstract class Room {
    id: number;
    doors: { roomId: number; direction: Direction; }[] = [];

    constructor(id: number) {
        this.id = id;
    }

    getRoomId(doorDirection: Direction): number | undefined {
        const door = this.doors.find(d => d.direction == doorDirection);
        return door?.roomId;
    }

    enter(player: Player): string {
        player.currentRoomId = this.id;
        return `You entered room #${this.id.toString().padStart(2, '0')}. `;
    }

    connect(room: Room): void {
        const dir = this.getRandomDirection();
        this.doors.push({ roomId: room.id, direction: dir });
        room.doors.push({ roomId: this.id, direction: this.getOppositeDirection(dir) });
    }

    protected describeDoors(): string {
        let message = `You see ${this.doors.length} ${this.doors.length > 1 ? 'doors' : 'door'} located `;

        if (this.doors.length <= 2) {
            message += this.doors.map(d => d.direction).join(' and ');
        }
        else {
            let doors = this.doors.slice(0, this.doors.length - 1).map(d => d.direction).join(', ');
            doors += `, and ${this.doors[this.doors.length - 1].direction}`;
            message += doors;
        }

        return message + '. ';
    }

    private getRandomDirection(): Direction {
        const usedDirections = this.doors.map(d => d.direction);
        const availableDirections = directions.filter(d => usedDirections.indexOf(d) < 0);

        return Utils.getRandomItem(availableDirections);
    }

    private getOppositeDirection(direction: Direction): Direction {
        switch (direction) {
            case 'North': return 'South';
            case 'South': return 'North';
            case 'East': return 'West';
            case 'West': return 'East';
        }
    }
}

export class EmptyRoom extends Room {
    enter(player: Player): string {
        let message = super.enter(player);
        message += 'The room is empty. ';
        message += this.describeDoors();

        return message;
    }
}

export class SpikesRoom extends Room {
    damage: number;

    constructor(id: number) {
        super(id);
        this.damage = Utils.getRandomItem([10, 20, 50, 80]);
    }

    enter(player: Player): string {
        player.hp -= this.damage;

        let message = super.enter(player);
        message += `Oh no, spikes! You lost ${this.damage} HP points! `;
        if (player.alive)
            message += this.describeDoors();

        return message;
    }
}

export class TreasureRoom extends Room {
    enter(player: Player): string {
        player.treasureFound = true;

        let message = super.enter(player);
        message += 'Congratulations! You found the treasure! ';

        return message;
    }
}