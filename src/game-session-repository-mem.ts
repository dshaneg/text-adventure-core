'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameState } from './game-state';
import uuid = require('uuid');

export class GameSessionRepositoryMem implements GameSessionRepository {
  constructor() {
    this.sessions = new Map();
  }

  public sessions: Map<string, GameState>;

  create() {
    const token = uuid.v4();

    const gameState = new GameState();

    this.sessions.set(token, gameState);

    return token;
  }

  get(sessionToken: string): GameState {
    return this.sessions.get(sessionToken);
  }

  set(sessionToken: string, gameState: GameState) {
    this.sessions.set(sessionToken, gameState);
  }
}
