'use strict';

import { GameSessionRepository } from './game-session-repository';
import { GameSessionRepositoryMem } from './impl/game-session-repository-mem';

import { MapNodeRepository } from './map-node-repository';
import { MapNodeRepositoryDefault } from './impl/map-node-repository-default';

import { ItemRepository } from './item-repository';
import { ItemRepositoryDefault } from './impl/item-repository-default';

import { GameDefinitionRepository, GameDefinition } from './game-definition-repository';
import { GameDefinitionRepositoryDefault } from './impl/game-definition-repository-default';

import { CommandFactory } from './commands/command-factory';
import { Command } from './commands/command';

import { GameManager } from './game-manager';
import { GameEngine } from './game-engine';
import { GameState } from './state/game-state';
import { GameStateEventSubscriberFactory } from './game-state-event-subscriber-factory';

// command parsers
import { Parser } from './parsers/parser';
import { MoveParser } from './parsers/move-parser';
import { ListInventoryParser } from './parsers/list-inventory-parser';
import { HelpParser } from './parsers/help-parser';
import { StartGameParser } from './parsers/start-game-parser';
import { StopGameParser } from './parsers/stop-game-parser';

// dev-mode (cheat) command parsers
import { TeleportParser } from './parsers/teleport-parser';
import { ConjureItemParser } from './parsers/conjure-item-parser';

// interface exports
export { Parser } from './parsers/parser';
export { Command } from './commands/command';
export { EventPublisher } from './domain/event-publisher';
export { GameManager } from './game-manager';
export { GameSessionRepository } from './game-session-repository';
export { MapNodeRepository } from './map-node-repository';
export { ItemRepository } from './item-repository';
export { GameDefinitionRepository, GameDefinition } from './game-definition-repository';

// class exports
export { Voice } from './domain/voice';
export { GameEngine } from './game-engine';
export { GameState } from './state/game-state';

export class TextAdventureCore {
  static createGameManager(gameSessionRepository: GameSessionRepository): GameManager {
    return new GameManager(gameSessionRepository);
  }

  static createGameEngine(
    gameDefinitionRepository: GameDefinitionRepository,
    mapNodeRepository: MapNodeRepository,
    itemRepository: ItemRepository,
    clientParserChain: Parser,
    debugMode: boolean = false): GameEngine {

    const commandFactory = new CommandFactory(gameDefinitionRepository, mapNodeRepository, itemRepository);

    const parser = buildParserChain(commandFactory, clientParserChain, debugMode);

    return new GameEngine(parser, new GameStateEventSubscriberFactory(mapNodeRepository), mapNodeRepository);
  }

  static defaultImplementations = {
    GameSessionRepository: GameSessionRepositoryMem,
    ItemRepository: ItemRepositoryDefault,
    GameDefinitionRepository: GameDefinitionRepositoryDefault,
    MapNodeRepository: MapNodeRepositoryDefault
  };
}

function buildParserChain(commandFactory: CommandFactory, clientParserChain: Parser, debugMode: boolean = false) {
  const head = new MoveParser(commandFactory);
  let tail = head
    .setNext(new ListInventoryParser(commandFactory))
    .setNext(new HelpParser(commandFactory))
    .setNext(new StartGameParser(commandFactory))
    .setNext(new StopGameParser(commandFactory));

  if (debugMode) {
    tail = tail
      .setNext(new TeleportParser(commandFactory))
      .setNext(new ConjureItemParser(commandFactory));
  }

  if (clientParserChain) {
    tail = tail.setNext(clientParserChain);
  }

  return head;
}