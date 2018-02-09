'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameState } from './game-state';

export class GameManager {
  private gameSessionRepository: GameSessionRepository;

  constructor(gameSessionRepository: any) {
    this.gameSessionRepository = gameSessionRepository;
  }

  createGame() {
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






