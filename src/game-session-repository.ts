import { GameState } from './state/game-state';
import uuid = require('uuid');

export abstract class GameSessionRepository {
    create(): GameState {
      const token = uuid.v4();
      const gameState = new GameState(token);

      this.set(token, gameState);

      return gameState;
    }

    abstract get(sessionToken: string): GameState;

    abstract set(sessionToken: string, gameState: GameState): void;
  }
