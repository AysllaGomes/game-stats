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
                    deathsByWorld: 0,
                    events: [] // Inicialize o array de eventos
                };
            } else if (line.includes('ShutdownGame')) {
                if (currentGame) {
                    games.push(currentGame as Game);
                    currentGame = null;
                }
            } else if (line.includes('Kill:')) {
                const match = line.match(/Kill:\s*\d+\s*\d+\s*\d+: ([^\s]+)\skilled\s([^\s]+)\sby\s(.+)/);

                if (match) {
                    const [, killer, killed, cause] = match;

                    if (currentGame) {
                        currentGame.events.push({
                            type: 'Kill',
                            killer,
                            killed,
                            cause
                        });

                        if (cause === 'MOD_TRIGGER_HURT') {
                            currentGame.deathsByWorld = (currentGame.deathsByWorld || 0) + 1;
                        } else {
                            currentGame.deathsByCause[cause] = (currentGame.deathsByCause[cause] || 0) + 1;
                        }
                        currentGame.totalDeaths = (currentGame.totalDeaths || 0) + 1;
                    }
                }
            } else if (line.includes('ClientUserinfoChanged')) {
                const match = line.match(/ClientUserinfoChanged:\s*(\d+)\sn\\([^\s]+)\\/);

                if (match) {
                    const [, id, newName] = match;

                    if (currentGame) {
                        currentGame.events.push({
                            type: 'ClientUserinfoChanged',
                            id,
                            newName
                        });
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

    getDeathsByWorld(): number[] {
        return this.games.map(game => game.deathsByWorld);
    }

    getAllGameStatistics(): {
        totalDeaths: number;
        deathsByCause: {
            [key: string]: number;
        };
        deathsByWorld: number;
    } []
    {
        return this.games.map(game => ({
            totalDeaths: game.totalDeaths,
            deathsByCause: game.deathsByCause,
            deathsByWorld: game.deathsByWorld,
        }));
    }

    getGameStatistics(index: number): any {
        const game: Game = this.games[index];
        if (!game) { return { message: 'Game not found' }; }

        return {
            totalDeaths: game.totalDeaths,
            deathsByCause: game.deathsByCause,
            deathsByWorld: game.deathsByWorld,
        };
    }

    getGameByIndex(index: number): Game | undefined {
        return this.games[index];
    }

    getRankingByGame(index: number): any {
        const game: Game = this.getGameByIndex(index);
        if (!game) { return null; }

        const playerScores: { [player: string]: number } = {};
        const playerAliases: { [player: string]: string } = {};

        if (game.events) {
            game.events.forEach(event => {
                if (event.type === 'Kill') {
                    const killer = event.killer;
                    const killed = event.killed;
                    const cause = event.cause;

                    if (killer !== '<world>') {
                        const killerName = playerAliases[killer] || killer;
                        playerScores[killerName] = (playerScores[killerName] || 0) + 1;
                    }

                    const killedName = playerAliases[killed] || killed;
                    if (cause === 'MOD_TRIGGER_HURT') {
                        playerScores[killedName] = (playerScores[killedName] || 0) - 1;
                    }
                } else if (event.type === 'ClientUserinfoChanged') {
                    const { id, newName } = event;
                    playerAliases[id] = newName;
                }
            });
        }

        return Object.keys(playerScores)
            .map(player => ({ player, score: playerScores[player] }))
            .sort((a, b) => b.score - a.score);
    }
}
