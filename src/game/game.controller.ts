import { Controller, Get, Param } from '@nestjs/common';

import { GameService } from './game.service';

@Controller('games')
export class GameController {
    constructor(
        private readonly gameService: GameService,
    ) {}

    @Get()
    getAllGames() {
        return this.gameService.getAllGames();
    }

    @Get(':gameId')
    getGameById(@Param('gameId') gameId: number) {
        return this.gameService.getGameById(gameId);
    }

    @Get('deaths-by-world')
    getDeathsByWorld(): number[] {
        return this.gameService.getDeathsByWorld();
    }

    @Get('statistics')
    getAllGameStatistics() {
        return this.gameService.getAllGameStatistics();
    }

    @Get(':index/statistics')
    getGameStatistics(@Param('index') index: string) {
        const gameIndex: number = parseInt(index, 10);
        return this.gameService.getGameStatistics(gameIndex);
    }

    @Get(':index/ranking')
    getRankingByGame(@Param('index') index: string) {
        const gameIndex: number = parseInt(index, 10);
        const ranking = this.gameService.getRankingByGame(gameIndex);

        if (ranking === null) { return { message: 'Game not found' }; }

        return ranking;
    }
}
