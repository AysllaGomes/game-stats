import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import * as fs from 'fs';
import { Game } from './entities/game.entity';

jest.mock('fs');

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);

    // Reset the games array before each test
    service['games'] = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loadGamesFromFile', () => {
    it('should load games from file and parse them correctly', () => {
      const mockFileContent = `
      InitGame: \n
      Kill: 1022 2 22: <world> killed player1 by MOD_TRIGGER_HURT\n
      ClientUserinfoChanged: 2 n\\player1\\\n
      ShutdownGame:
      `;
      (fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent);

      service['loadGamesFromFile']();

      expect(service.getAllGames()).toHaveLength(20);
      expect(service.getAllGames()[0]).toEqual({
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 0,
        events: [
          {
            type: 'ClientUserinfoChanged',
            id: '2',
            newName: 'Isgalamido\\t\\0\\model\\xian/default\\hmodel\\xian/default\\g_redteam\\\\g_blueteam\\\\c1\\4\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl'
          },
          {
            type: 'ClientUserinfoChanged',
            id: '2',
            newName: 'Isgalamido\\t\\0\\model\\uriel/zael\\hmodel\\uriel/zael\\g_redteam\\\\g_blueteam\\\\c1\\5\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl'
          }
        ],
      });
    });
  });

  describe('getGameById', () => {
    it('should return the game with the specified ID', () => {
      const mockGames: Game[] = [{
        id: 1,
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 0,
        events: [],
      }];
      service['games'] = mockGames;
      expect(service.getGameById(1)).toEqual(mockGames[0]);
    });
  });

  describe('getAllGames', () => {
    it('should return all games', () => {
      const mockGames: Game[] = [{
        id: 1,
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 0,
        events: [],
      }];
      service['games'] = mockGames;
      expect(service.getAllGames()).toEqual(mockGames);
    });
  });

  describe('getDeathsByWorld', () => {
    it('should return an array of deaths by world for each game', () => {
      service['games'] = [{
        id: 1,
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 2,
        events: [],
      }];
      expect(service.getDeathsByWorld()).toEqual([2]);
    });
  });

  describe('getAllGameStatistics', () => {
    it('should return statistics for all games', () => {
      service['games'] = [{
        id: 1,
        totalDeaths: 1,
        deathsByCause: { 'MOD_TRIGGER_HURT': 1 },
        deathsByWorld: 1,
        events: [],
      }];
      expect(service.getAllGameStatistics()).toEqual([{
        totalDeaths: 1,
        deathsByCause: { 'MOD_TRIGGER_HURT': 1 },
        deathsByWorld: 1,
      }]);
    });
  });

  describe('getGameStatistics', () => {
    it('should return statistics for a specific game by index', () => {
      service['games'] = [{
        id: 1,
        totalDeaths: 1,
        deathsByCause: { 'MOD_TRIGGER_HURT': 1 },
        deathsByWorld: 1,
        events: [],
      }];
      expect(service.getGameStatistics(0)).toEqual({
        totalDeaths: 1,
        deathsByCause: { 'MOD_TRIGGER_HURT': 1 },
        deathsByWorld: 1,
      });
    });

    it('should return a message if the game is not found', () => {
      service['games'] = [];
      expect(service.getGameStatistics(0)).toEqual({ message: 'Game not found' });
    });
  });

  describe('getRankingByGame', () => {
    it('should return ranking by game index', () => {
      service['games'] = [{
        id: 1,
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 0,
        events: [
          { type: 'Kill', killer: 'player1', killed: 'player2', cause: 'MOD_SHOTGUN' },
          { type: 'Kill', killer: 'player1', killed: 'player2', cause: 'MOD_SHOTGUN' },
          { type: 'Kill', killer: '<world>', killed: 'player1', cause: 'MOD_TRIGGER_HURT' },
        ],
      }];
      expect(service.getRankingByGame(0)).toEqual([
        { player: 'player1', score: 1 }
      ]);
    });

    it('should return null if the game is not found', () => {
      service['games'] = [];
      expect(service.getRankingByGame(0)).toBeNull();
    });
  });
});
