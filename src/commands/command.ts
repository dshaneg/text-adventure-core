'use strict';

import { GameState } from '../game-state';

export type AddEventCall = (event: any) => void;

export interface Command {
  execute(gameState: GameState, addEvent: AddEventCall): void;
}
