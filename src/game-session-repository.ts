import { GameState } from './game-state';

export interface GameSessionRepository {
    create(): string;

    get(sessionToken: string): GameState;

    set(sessionToken: string, gameState: GameState): void;
  }
