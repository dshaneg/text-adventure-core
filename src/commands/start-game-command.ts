'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../state/game-state';
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
  constructor(
    private commandFactory: CommandFactory,
    repositorySet: RepositorySet) {

    this.itemRepository = repositorySet.itemRepository;
    this.gameDefinitionRepository = repositorySet.gameDefinitionRepository;
    this.mapNodeRepository = repositorySet.mapNodeRepository;
  }

  private itemRepository: ItemRepository;
  private gameDefinitionRepository: GameDefinitionRepository;
  private mapNodeRepository: MapNodeRepository;

  execute(gameState: GameState, addEvent: AddEventCall): void {
    if (gameState.isStarted) {
      return;
    }

    const silentMode = true;

    // initialize starting inventory
    this.commandFactory.createAddInventoryCommand(this.itemRepository.startSet, silentMode).execute(gameState, addEvent);

    for (const startItem of this.itemRepository.startSet) {
      if (startItem.equip) {
        this.commandFactory.createEquipItemCommand(startItem.item, silentMode).execute(gameState, addEvent);
      }
    }

    addEvent({
      topic: 'game.starting',
      message: this.gameDefinitionRepository.gameDefinition.banner,
      voice: Voice.herald
    });

    gameState.start();

    addEvent({
      topic: 'game.started',
      message: this.gameDefinitionRepository.gameDefinition.opening,
      voice: Voice.bard
    });

    this.commandFactory.createTeleportCommand(this.mapNodeRepository.gameMap.entryNode.id, true).execute(gameState, addEvent);
  }
}

