'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { ReadOnlyGameState } from '../state/game-state';
import { CommandFactory } from './command-factory';

import { ItemRepository } from '../item-repository';
import { GameDefinitionRepository, GameDefinition } from '../game-definition-repository';
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

  execute(gameState: ReadOnlyGameState, publisher: EventPublisher): void {
    if (gameState.isStarted) {
      return;
    }

    const silentMode = true;

    // initialize starting inventory
    const startSet = this.itemRepository.getStartSet();

    this.commandFactory.createAddInventoryCommand(startSet, silentMode).execute(gameState, publisher);

    for (const startItem of startSet) {
      if (startItem.equip) {
        this.commandFactory.createEquipItemCommand(startItem.item, silentMode).execute(gameState, publisher);
      }
    }

    publisher.publish({
      topic: 'game.starting',
      message: this.gameDefinitionRepository.getGameDefinition().banner,
      voice: Voice.herald
    });

    publisher.publish({
      topic: 'game.started',
      message: this.gameDefinitionRepository.getGameDefinition().opening,
      voice: Voice.bard
    });

    this.commandFactory.createTeleportCommand(this.mapNodeRepository.getMap().entryNode.id, true).execute(gameState, publisher);
  }
}

