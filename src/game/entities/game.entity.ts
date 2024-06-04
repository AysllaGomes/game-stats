import { Player } from './player.entity';

export class Game {
    id: number;
    name: string;
    players: Player[];
    totalDeaths: number;
    deathsByCause: { [key: string]: number };
    deathsByWorld: number;
    createdAt: Date;
}
