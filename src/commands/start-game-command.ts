'use strict';

import { Command } from './command';
import { GameState } from '../game-state';
import { CommandFactory } from './command-factory';

import { ItemRepository, StartItemDef } from '../item-repository';
import { GameDefinitionRepository } from '../game-definition-repository';
import { MapNodeRepository } from '../map-node-repository';

export type RepositorySet = {
  itemRepository: ItemRepository,
  gameDefinitionRepository: GameDefinitionRepository,
  mapNodeRepository: MapNodeRepository
};

/**
 * Class representing a command instructing the game to initialize and start.
 */
export class StartGameCommand {
  constructor(commandFactory: CommandFactory, repositorySet: RepositorySet) {
    this.commandFactory = commandFactory;

    this.itemRepository = repositorySet.itemRepository;
    this.gameDefinitionRepository = repositorySet.gameDefinitionRepository;
    this.mapNodeRepository = repositorySet.mapNodeRepository;

    this.data = {};
  }

  private commandFactory: CommandFactory;

  private itemRepository: ItemRepository;
  private gameDefinitionRepository: GameDefinitionRepository;
  private mapNodeRepository: MapNodeRepository;

  public data: {};

  execute(gameState: GameState): void {
    if (gameState.isStarted) {
      // todo: should warn when this happens--it isn't supposed to.
      return;
    }

    // initialize starting inventory
    this.commandFactory.createAddInventoryCommand(this.itemRepository.startSet).execute(gameState);

    for (const startItem of this.itemRepository.startSet) {
      if (startItem.equip) {
        this.commandFactory.createEquipItemCommand(startItem.item).execute(gameState);
      }
    }

    gameState.start(this.gameDefinitionRepository.gameDefinition);

    this.commandFactory.createTeleportCommand(this.mapNodeRepository.gameMap.entryNode.id).execute(gameState);
  }
}

