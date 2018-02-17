'use strict';

import { GameState } from '../state/game-state';
import { EventPublisher } from '../domain/event-publisher';

export interface Command {
  execute(gameState: GameState, publisher: EventPublisher): void;
}
