'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameSessionRepositoryMem } from './impl/game-session-repository-mem';

import { GameDefinitionRepository } from './game-definition-repository';
import { MapNodeRepositoryDefault } from './impl/map-node-repository-default';
import { ItemRepositoryDefault } from './impl/item-repository-default';

import { CommandFactory } from './commands/command-factory';

import { GameManager } from './game-manager';
import { GameEngine } from './game-engine';
import { GameState } from './state/game-state';

// command parsers
import { MoveParser } from './parsers/move-parser';
import { ListInventoryParser } from './parsers/list-inventory-parser';
import { HelpParser } from './parsers/help-parser';
import { StartGameParser } from './parsers/start-game-parser';
import { StopGameParser } from './parsers/stop-game-parser';

// dev-mode (cheat) command parsers
import { TeleportParser } from './parsers/teleport-parser';
import { ConjureItemParser } from './parsers/conjure-item-parser';

export { Voice } from './voice';
export { GameManager } from './game-manager';
export { GameEngine } from './game-engine';
export { GameState } from './state/game-state';

// interfaces
export { GameSessionRepository } from './game-session-repository';
import { MapNodeRepository } from './map-node-repository';
export { MapNodeRepository } from './map-node-repository';
import { ItemRepository } from './item-repository';
export { ItemRepository } from './item-repository';

export class TextAdventureCore {
  static createGameManager(gameSessionRepository: GameSessionRepository): GameManager {
    return new GameManager(gameSessionRepository);
  }

  static createGameEngine(
    gameDefinitionRepository: GameDefinitionRepository,
    mapNodeRepository: MapNodeRepository,
    itemRepository: ItemRepository,
    debugMode: boolean = false): GameEngine {

    const commandFactory = new CommandFactory(gameDefinitionRepository, mapNodeRepository, itemRepository);

    const parser = buildParserChain(commandFactory, debugMode);

    return new GameEngine(parser, mapNodeRepository);
  }

  static defaultImplementations = {
    GameSessionRepositoryMem,
    ItemRepositoryDefault,
    GameDefinitionRepository,
    MapNodeRepositoryDefault
  };
}

function buildParserChain(commandFactory: CommandFactory, debugMode: boolean = false) {
  const head = new MoveParser(commandFactory);
  const tail = head
    .setNext(new ListInventoryParser(commandFactory))
    .setNext(new HelpParser(commandFactory))
    .setNext(new StartGameParser(commandFactory))
    .setNext(new StopGameParser(commandFactory));

  if (debugMode) {
    tail
      .setNext(new TeleportParser(commandFactory))
      .setNext(new ConjureItemParser(commandFactory));
  }

  return head;
}