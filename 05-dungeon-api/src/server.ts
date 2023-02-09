import express, { Express, Request, Response } from 'express';
import { Dungeon } from './dungeon';
import { Player } from './player';

const app: Express = express();
const port = 3000;

let dungeon: Dungeon | null = null;
let player: Player | null = null;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to TSG Dungeon REST API! Use api/start to begin');
});

app.post('/api/start', (req: Request<{}, {}, {}, { rooms?: number }>, res: Response) => {
    player = new Player();
    dungeon = new Dungeon(req.query.rooms ?? 6);
    dungeon.createRooms();

    res.send(dungeon.rooms[0].enter(player));
});

app.post('/api/go/:direction', (req: Request<{ direction: 'N' | 'S' | 'E' | 'W' }>, res: Response) => {
    if (!dungeon || !player) {
        res.send(`The game is not ready. Use "POST api/start" to generate one.`);
        return;
    }

    const roomId = dungeon.rooms[player.currentRoomId].getRoomId(req.params.direction);
    if (roomId) {
        let message = dungeon.rooms[roomId].enter(player);

        if (player.treasureFound) {
            message = 'You won!';
            resetGame();
        }

        if (!player?.alive) {
            message = 'Game over!';
            resetGame();
        }

        res.send(message);
        return;
    }

    res.send(`There's no door in that direction!`);
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server running at http://localhost:${port}`);
});

function resetGame() {
    dungeon = null;
    player = null;
}