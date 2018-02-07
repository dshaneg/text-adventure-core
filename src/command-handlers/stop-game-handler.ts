'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { StopGameCommand, StopGameData } from '../commands/stop-game-command';
import { GameState } from '../game-state';

export class StopGameHandler extends CommandHandler {
  subscribeToTopic() {
    commandChannel.subscribe(StopGameCommand.topic, (data: StopGameData) => StopGameHandler.handle(data));
  }

  static handle(data: StopGameData) {
    if (data.force) {
      eventChannel.publish('game.stopped', { gameState: data.gameState });
    } else {
      eventChannel.publish('game.stop-requested', { gameState: data.gameState });
    }
  }
}

