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
    // initialize starting inventory
    this.commandFactory.createAddInventoryCommand(this.itemRepository.startSet).execute(gameState);

    for (const startItem of this.itemRepository.startSet) {
      if (startItem.equip) {
        this.commandFactory.createEquipItemCommand(startItem.item).execute(gameState);
      }
    }

    gameState.start();
    // game.started (used to be) a trigger for other subscribers (notably text-engine) to add their subscriptions after initialization
    // TODO: move this text to an event published by gamestate when the game is started.
    // gamestate will accumulate events to be flushed before returning...maybe
    // eventChannel.publish(
    //   'game.started',
    //   {
    //     banner: this.gameDefinitionRepository.gameDefinition.banner,
    //     text: this.gameDefinitionRepository.gameDefinition.opening
    //   }
    // );

    this.commandFactory.createTeleportCommand(this.mapNodeRepository.gameMap.entryNode.id).execute(gameState);
  }
}

