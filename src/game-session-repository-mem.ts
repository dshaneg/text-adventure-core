'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameState } from './game-state';

export class GameSessionRepositoryMem extends GameSessionRepository {
  constructor() {
    super();
    this.sessions = new Map();
  }

  private sessions: Map<string, GameState>;

  get(sessionToken: string): GameState {
    return this.sessions.get(sessionToken);
  }

  set(sessionToken: string, gameState: GameState) {
    this.sessions.set(sessionToken, gameState);
  }
}
