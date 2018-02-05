'use strict';

// command parsers
import { MoveParser } from './parsers/move-parser';
import { ListInventoryParser } from './parsers/list-inventory-parser';
import { ExitParser } from './parsers/exit-parser';
import { HelpParser } from './parsers/help-parser';

// dev-mode (cheat) command parsers
import { TeleportParser } from './parsers/teleport-parser';
import { ConjureItemParser } from './parsers/conjure-item-parser';
import { eventChannel, queryChannel, commandChannel, clientEventChannel, clientCommandChannel } from './message-bus';

import { StartGameCommand } from './commands/start-game-command';
import { StopGameCommand } from './commands/stop-game-command';

const parser = new MoveParser();
const chainTail = parser
  .setNext(new ListInventoryParser())
  .setNext(new ExitParser())
  .setNext(new HelpParser());

chainTail
  .setNext(new TeleportParser())
  .setNext(new ConjureItemParser());

import { GameEngine } from './game-engine';

const gameEngine = new GameEngine();
gameEngine.initialize();

export const bus = {
  eventChannel,
  queryChannel,
  commandChannel,
  clientEventChannel,
  clientCommandChannel
};

export const commands = {
  StartGameCommand,
  StopGameCommand
};