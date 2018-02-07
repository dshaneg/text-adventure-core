'use strict';

// command parsers
import { MoveParser } from './parsers/move-parser';
import { ListInventoryParser } from './parsers/list-inventory-parser';
import { ExitParser } from './parsers/exit-parser';
import { HelpParser } from './parsers/help-parser';

// dev-mode (cheat) command parsers
import { TeleportParser } from './parsers/teleport-parser';
import { ConjureItemParser } from './parsers/conjure-item-parser';
// import { eventChannel, queryChannel, commandChannel, clientEventChannel, clientCommandChannel } from './message-bus';

import { GameSessionRepositoryMem } from './game-session-repository-mem';
import { CreateGameHandler } from './command-handlers/create-game-handler';
// import { StartGameCommand } from './commands/start-game-command';
// import { StopGameCommand } from './commands/stop-game-command';
import { GameManager } from './game-manager';
import { GameEngine } from './game-engine';

const gameSessionRepository = new GameSessionRepositoryMem();

const parser = new MoveParser();
const chainTail = parser
  .setNext(new ListInventoryParser())
  .setNext(new ExitParser())
  .setNext(new HelpParser());

chainTail
  .setNext(new TeleportParser())
  .setNext(new ConjureItemParser());

export const gameEngine = new GameEngine();

export const gameManager = new GameManager(gameSessionRepository);

// export const bus = {
//   eventChannel,
//   queryChannel,
//   commandChannel,
//   clientEventChannel,
//   clientCommandChannel
// };

// export const commands = {
//   CreateGameCommand,
//   StartGameCommand,
//   StopGameCommand
// };