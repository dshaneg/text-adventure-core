'use strict';

import { GameState } from '../game-state';

export interface Command {
  execute(gameState: GameState): void;
}
