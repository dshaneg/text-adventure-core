'use strict';

import { GameSessionRepository } from './game-session-repository';

export class GameManager {
  private gameSessionRepository: GameSessionRepository;

  constructor(gameSessionRepository: any) {
    this.gameSessionRepository = gameSessionRepository;
  }

  createGame() {
    const sessionToken = this.gameSessionRepository.create();

    return sessionToken;
  }
}






