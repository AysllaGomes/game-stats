import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
    private games: Game[] = [];

    constructor() {}

    getAllGames(): Game[] {
        return this.games;
    }

    getGameById(gameId: number): Game {
        return this.games.find(game => game.id === gameId);
    }

}