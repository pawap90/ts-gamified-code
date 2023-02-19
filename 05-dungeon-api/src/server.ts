import express, { Express, Request, Response } from 'express';
import { Dungeon } from './dungeon';
import { Player } from './player';
import { Direction } from './room';

const app: Express = express();
const port = 3000;

let dungeon: Dungeon | null = null;
let player: Player | null = null;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to TSG Dungeon REST API! Use api/start to begin');
});

app.post('/api/start', (req: Request<unknown, unknown, unknown, { easy: boolean }>, res: Response) => {
    player = new Player();
    if (req.query.easy)
        dungeon = Dungeon.createEasyMode();
    else
        dungeon = Dungeon.createRandom();

    const room = dungeon.firstRoom;
    console.info(room);
    room.enter(player);
    res.send(room.describe());
});


app.post('/api/go/:direction', (req: Request<{ direction: Direction }>, res: Response) => {
    if (!dungeon || !player) {
        res.send('The game is not ready. Use "POST api/start".');
        return;
    }

    const currentRoom = dungeon.getRoom(player.currentRoomId);
    const targetRoomId = currentRoom?.getRoomId(req.params.direction);
    
    if (targetRoomId != undefined) {
        const targetRoom = dungeon.getRoom(targetRoomId)!;
        targetRoom.enter(player);
        let message = targetRoom.describe();

        if (player.treasureFound) {
            message += 'You won!';
            resetGame();
        }
        else if (!player?.alive) {
            message += 'Game over!';
            resetGame();
        }

        res.send(message);
        return;
    }

    res.send('No door in that direction!');
});

app.listen(port, () => {
    console.info(`⚡️[server]: Server running at http://localhost:${port}`);
});

function resetGame(): void {
    dungeon = null;
    player = null;
}