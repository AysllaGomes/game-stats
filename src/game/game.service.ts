import * as fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
    private games: Game[] = [];

    constructor() {
        this.loadGamesFromFile();
    }

    private loadGamesFromFile(): void {
        const logFilePath = 'games.log';
        try {
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            this.games = this.parseLogContent(logContent);
        } catch (error) {
            console.error(`Failed to read log file: ${error.message}`);
        }
    }

    private parseLogContent(logContent: string): Game[] {
        const games: Game[] = [];
        let currentGame: Partial<Game> | null = null;

        const lines = logContent.split('\n');

        lines.forEach(line => {
            if (line.includes('InitGame')) {
                currentGame = {
                    totalDeaths: 0,
                    deathsByCause: {},
                    deathsByWorld: 0
                };
            } else if (line.includes('ShutdownGame')) {
                if (currentGame) {
                    games.push(currentGame as Game);
                    currentGame = null;
                }
            } else if (line.includes('Kill:')) {
                const match = line.match(/Kill:\s*\d+\s*\d+\s*\d+: ([^\s]+)\skilled\s([^\s]+)\sby\s(.+)/);

                if (match) {
                    const [, killedBy, killed, cause] = match;

                    if (currentGame) {
                        if (cause === 'MOD_TRIGGER_HURT') {
                            currentGame.deathsByWorld = (currentGame.deathsByWorld || 0) + 1;
                        } else {
                            currentGame.deathsByCause[cause] = (currentGame.deathsByCause[cause] || 0) + 1;
                        }
                        currentGame.totalDeaths = (currentGame.totalDeaths || 0) + 1;
                    }
                }
            }
        });

        return games;
    }

    getGameById(gameId: number): Game | undefined {
        return this.games.find(game => game.id === gameId);
    }

    getAllGames(): Game[] {
        return this.games;
    }
}