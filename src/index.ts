'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameSessionRepositoryMem } from './game-session-repository-mem';

import { GameDefinitionRepository } from './game-definition-repository';
import { MapNodeRepository } from './map-node-repository';
import { ItemRepository } from './item-repository';

import { CommandFactory } from './commands/command-factory';

import { GameManager } from './game-manager';
import { GameEngine } from './game-engine';

// command parsers
import { MoveParser } from './parsers/move-parser';
import { ListInventoryParser } from './parsers/list-inventory-parser';
import { HelpParser } from './parsers/help-parser';
import { StartGameParser } from './parsers/start-game-parser';
import { StopGameParser } from './parsers/stop-game-parser';

// dev-mode (cheat) command parsers
import { TeleportParser } from './parsers/teleport-parser';
import { ConjureItemParser } from './parsers/conjure-item-parser';

export class TextAdventureCore {
  static createGameManager(gameSessionRepository: GameSessionRepository) {
    return new GameManager(gameSessionRepository);
  }

  static createGameEngine(
    gameDefinitionRepository: GameDefinitionRepository,
    mapNodeRepository: MapNodeRepository,
    itemRepository: ItemRepository,
    debugMode: boolean = false) {

    const commandFactory = new CommandFactory(gameDefinitionRepository, mapNodeRepository, itemRepository);

    const parser = buildParserChain(commandFactory, debugMode);

    return new GameEngine(parser, mapNodeRepository);
  }

  static interfaces = {
    GameSessionRepository
  };

  static defaultImplementations = {
    GameSessionRepositoryMem,
    ItemRepository,
    GameDefinitionRepository,
    MapNodeRepository
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