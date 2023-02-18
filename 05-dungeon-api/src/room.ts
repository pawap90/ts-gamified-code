import { Bandit, Enemy, Rat, Troll } from './enemy';
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

    enter(player: Player): void {
        player.currentRoomId = this.id;
    }

    abstract describe(): string;

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

    connect(room: Room): void {
        const dir = this.getRandomDirection();
        this.doors.push({ roomId: room.id, direction: dir });
        room.doors.push({ roomId: this.id, direction: this.getOppositeDirection(dir) });
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
    describe(): string {
        let message = 'The room is empty. ';
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

    enter(player: Player): void {
        super.enter(player);
        player.hp -= this.damage;
    }

    describe(): string {
        let message = `Oh no, spikes! You lost ${this.damage} HP points! `;

        message += this.describeDoors();
        return message;
    }
}

export class TreasureRoom extends Room {
    enter(player: Player): void {
        super.enter(player);
        player.treasureFound = true;
    }

    describe(): string {
        return 'Congratulations! You found the treasure!';
    }
}

export class EnemyRoom extends Room {
    enemy: Enemy;

    constructor(id: number) {
        super(id);
        this.enemy = this.createEnemy();
    }

    enter(player: Player): void {
        super.enter(player);

        if (this.enemy.alive)
            this.enemy.fight(player);
    }

    describe(): string {

        let message = '';

        if (this.enemy.alive)
            message += `You were defeated by ${this.enemy.name}! `;
        else {
            message += `You defeated ${this.enemy.name}! `;
            message += this.describeDoors();
        }

        return message;
    }

    private createEnemy(): Enemy {
        const enemies = ['rat', 'bandit', 'troll'];
        const randomEnemy = Utils.getRandomItem(enemies);

        switch (randomEnemy) {
            case 'troll':
                return new Troll();
            case 'bandit':
                return new Bandit();
            default:
                return new Rat();
        }
    }
}

export class HealingPotionRoom extends Room {
    healingPoints = 0;
    used = false;

    enter(player: Player): void {
        super.enter(player);

        this.healingPoints = 0;
        if (player.hp < 100 && !this.used) {
            this.healingPoints = Utils.getRandomNumber(1, 100 - player.hp);
            player.hp += this.healingPoints;
            this.used = true;
        }
    }

    describe(): string {
        let message = 'You found a Healing Potion! ';

        if (this.healingPoints > 0)
            message += `Your HP is restored by ${this.healingPoints} points. `;
        else if (this.used)
            message += 'Empty! You already used this potion. ';
        else
            message += 'Your HP was already full. ';

        message += this.describeDoors();
        return message;
    }
}