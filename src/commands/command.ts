'use strict';

import { ReadOnlyGameState } from '../state/game-state';
import { EventPublisher } from '../domain/event-publisher';

export interface Command {
  execute(gameState: ReadOnlyGameState, publisher: EventPublisher): void;
}
