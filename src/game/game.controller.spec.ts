import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: {
            getAllGames: jest.fn(),
            getGameById: jest.fn(),
            getDeathsByWorld: jest.fn(),
            getAllGameStatistics: jest.fn(),
            getGameStatistics: jest.fn(),
            getRankingByGame: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  it('should be defined', (): void => {
    expect(controller).toBeDefined();
  });

  describe('getAllGames', (): void => {
    it('should return an array of games', (): void => {
      const result: Game[] = [{
        id: 1,
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 0,
        events: [],
      }];
      jest.spyOn(service, 'getAllGames').mockReturnValue(result);

      expect(controller.getAllGames()).toBe(result);
    });
  });

  describe('getGameById', (): void => {
    it('should return a game with the specified ID', (): void => {
      const result: Game = {
        id: 1,
        totalDeaths: 0,
        deathsByCause: {},
        deathsByWorld: 0,
        events: [],
      };
      jest.spyOn(service, 'getGameById').mockReturnValue(result);

      expect(controller.getGameById(1)).toBe(result);
    });
  });

  describe('getDeathsByWorld', (): void => {
    it('should return an array of deaths by world', (): void => {
      const result = [1, 2, 3];
      jest.spyOn(service, 'getDeathsByWorld').mockReturnValue(result);

      expect(controller.getDeathsByWorld()).toBe(result);
    });
  });

  describe('getAllGameStatistics', (): void => {
    it('should return statistics for all games', (): void => {
      const result = [{ totalDeaths: 1, deathsByCause: {}, deathsByWorld: 1 }];
      jest.spyOn(service, 'getAllGameStatistics').mockReturnValue(result);

      expect(controller.getAllGameStatistics()).toBe(result);
    });
  });

  describe('getGameStatistics', (): void => {
    it('should return statistics for a specific game by index', (): void => {
      const result = { totalDeaths: 1, deathsByCause: {}, deathsByWorld: 1 };
      jest.spyOn(service, 'getGameStatistics').mockReturnValue(result);

      expect(controller.getGameStatistics('1')).toBe(result);
    });
  });

  describe('getRankingByGame', (): void => {
    it('should return ranking by game index', (): void => {
      const result = [{ player: 'player1', score: 1 }];
      jest.spyOn(service, 'getRankingByGame').mockReturnValue(result);

      expect(controller.getRankingByGame('1')).toBe(result);
    });

    it('should return a message if the game is not found', (): void => {
      jest.spyOn(service, 'getRankingByGame').mockReturnValue(null);

      expect(controller.getRankingByGame('1')).toEqual({ message: 'Game not found' });
    });
  });
});
