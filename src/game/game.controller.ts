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
}