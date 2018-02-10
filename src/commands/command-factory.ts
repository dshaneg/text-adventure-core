'use strict';

import { Command } from './command';
import { ConjureItemCommand } from './conjure-item-command';
import { AddInventoryCommand } from './add-inventory-command';
import { StartGameCommand, RepositorySet } from './start-game-command';
import { EquipItemCommand } from './equip-item-command';
import { TeleportCommand } from './teleport-command';
import { MoveCommand } from './move-command';
import { HelpCommand } from './help-command';
import { ListInventoryCommand } from './list-inventory-command';
import { StopGameCommand } from './stop-game-command';

import { ItemRepository } from '../item-repository';
import { GameDefinitionRepository } from '../game-definition-repository';
import { MapNodeRepository } from '../map-node-repository';
import { GameMap } from '../game-map';

/**
 * Class representing a command instructing the game conjure an item from the nether.
 */
export class CommandFactory {

  constructor(
    gameDefinitionRepository: GameDefinitionRepository,
    mapNodeRepository: MapNodeRepository,
    itemRepository: ItemRepository) {

    this.gameDefinitionRepository = gameDefinitionRepository;
    this.mapNodeRepository = mapNodeRepository;
    this.itemRepository = itemRepository;
  }

  private gameDefinitionRepository: GameDefinitionRepository;
  private mapNodeRepository: MapNodeRepository;
  private itemRepository: ItemRepository;

  createAddInventoryCommand(deltas: Array<{ item: any, count: number }>) {
    return new AddInventoryCommand(deltas);
  }

  createConjureItemHandlerCommand(itemId: number, count: number) {
    return new ConjureItemCommand(this, this.itemRepository, itemId, count);
  }

  createEquipItemCommand(item: any) {
    return new EquipItemCommand(item);
  }

  createHelpCommand() {
    return new HelpCommand();
  }

  createListInventoryCommand() {
    return new ListInventoryCommand();
  }

  createMoveCommand(direction: string) {
    return new MoveCommand(direction);
  }

  createStartGameCommand() {
    const repositorySet: RepositorySet = {
        itemRepository: this.itemRepository,
        gameDefinitionRepository: this.gameDefinitionRepository,
        mapNodeRepository: this.mapNodeRepository
    };

    return new StartGameCommand(this, repositorySet);
  }

  createStopGameCommand(force: boolean) {
    return new StopGameCommand(force);
  }

  createTeleportCommand(targetNodeId: number) {
    return new TeleportCommand(this.mapNodeRepository.gameMap, targetNodeId);
  }
}
