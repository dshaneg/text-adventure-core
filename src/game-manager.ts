'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameState } from './state/game-state';

export class GameManager {
  constructor(private gameSessionRepository: any) {
  }

  createGame(): GameState {
    const gameState = this.gameSessionRepository.create();

    return gameState;
  }

  fetchGame(sessionToken: string): GameState {
    const gameState = this.gameSessionRepository.get(sessionToken);

    return gameState;
  }

  stashGame(sessionToken: string, gameState: GameState) {
    this.gameSessionRepository.set(sessionToken, gameState);
  }
}






