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
      eventChannel.publish({ topic: 'game.stopped', data: { gameState: data.gameState } });
    } else {
      eventChannel.publish({ topic: 'game.stop-requested', data: { gameState: data.gameState } });
    }
  }
}

