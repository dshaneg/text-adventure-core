'use strict';

import { Command, AddEventCall } from './command';
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
  }

  private commandFactory: CommandFactory;

  private itemRepository: ItemRepository;
  private gameDefinitionRepository: GameDefinitionRepository;
  private mapNodeRepository: MapNodeRepository;

  execute(gameState: GameState, addEvent: AddEventCall): void {
    if (gameState.isStarted) {
      return;
    }

    // initialize starting inventory
    this.commandFactory.createAddInventoryCommand(this.itemRepository.startSet).execute(gameState, addEvent);

    for (const startItem of this.itemRepository.startSet) {
      if (startItem.equip) {
        this.commandFactory.createEquipItemCommand(startItem.item).execute(gameState, addEvent);
      }
    }

    gameState.start();
    addEvent({
      topic: 'game.started',
      banner: this.gameDefinitionRepository.gameDefinition.banner,
      message: this.gameDefinitionRepository.gameDefinition.opening
    });

    this.commandFactory.createTeleportCommand(this.mapNodeRepository.gameMap.entryNode.id).execute(gameState, addEvent);
  }
}

