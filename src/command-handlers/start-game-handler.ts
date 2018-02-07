'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';

import { StartGameCommand, StartGameData } from '../commands/start-game-command';
import { AddInventoryCommand, AddInventoryData } from '../commands/add-inventory-command';
import { EquipItemCommand, EquipItemData } from '../commands/equip-item-command';
import { TeleportCommand, TeleportData } from '../commands/teleport-command';

import { ItemRepository, StartItemDef } from '../item-repository';
import { GameDefinitionRepository } from '../game-definition-repository';
import { MapNodeRepository } from '../map-node-repository';
import { GameState } from '../game-state';

export type RepositorySet = {
  itemRepository: ItemRepository,
  gameDefinitionRepository: GameDefinitionRepository,
  mapNodeRepository: MapNodeRepository
};

export class StartGameHandler extends CommandHandler {
  constructor(repositorySet: RepositorySet) {
    super();
    this.itemRepository = repositorySet.itemRepository;
    this.gameDefinitionRepository = repositorySet.gameDefinitionRepository;
    this.mapNodeRepository = repositorySet.mapNodeRepository;
  }

  private itemRepository: ItemRepository;
  private gameDefinitionRepository: GameDefinitionRepository;
  private mapNodeRepository: MapNodeRepository;

  subscribeToTopic() {
    commandChannel.subscribe(StartGameCommand.topic, (data: { gameState: GameState }) => this.handle(data));
  }

  handle(data: { gameState: GameState }) {
    try {
      data.gameState.start();

      // initialize starting inventory
      commandChannel.publish(AddInventoryCommand.topic, new AddInventoryCommand(data.gameState, this.itemRepository.startSet));

      for (const startItem of this.itemRepository.startSet) {
        if (startItem.equip) {
          commandChannel.publish(EquipItemCommand.topic, new EquipItemCommand(data.gameState, startItem.item));
        }
      }

      // game.started is a trigger for other subscribers (notably text-engine) to add their subscriptions after initialization
      eventChannel.publish(
        'game.started',
        {
          banner: this.gameDefinitionRepository.gameDefinition.banner,
          text: this.gameDefinitionRepository.gameDefinition.opening
        }
      );

      commandChannel.publish(TeleportCommand.topic, new TeleportCommand(data.gameState, this.mapNodeRepository.gameMap.entryNode.id));
    } catch (error) {
      eventChannel.publish('error', error);
    }
  }
}

