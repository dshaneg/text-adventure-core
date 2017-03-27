'use strict';

// repositories
import { GameDefinitionRepository } from './game-definition-repository';
import { MapNodeRepository } from './map-node-repository';
import { ItemRepository } from './item-repository';

// game command handlers
import { MoveHandler } from './command-handlers/move-handler';
import { ListInventoryHandler } from './command-handlers/list-inventory-handler';
import { HelpHandler } from './command-handlers/help-handler';
import { TeleportHandler } from './command-handlers/teleport-handler';
import { ConjureItemHandler } from './command-handlers/conjure-item-handler';
import { AddInventoryHandler } from './command-handlers/add-inventory-handler';
import { EquipItemHandler } from './command-handlers/equip-item-handler';
import { StartGameHandler } from './command-handlers/start-game-handler';
import { StopGameHandler } from './command-handlers/stop-game-handler';

export class GameEngine {
  initialize() {
    // repositories
    const itemRepository = new ItemRepository();
    const mapNodeRepository = new MapNodeRepository();
    const gameDefinitionRepository = new GameDefinitionRepository();

    const repositorySet = {
      itemRepository,
      gameDefinitionRepository,
      mapNodeRepository
    };

    new MoveHandler().subscribe();
    new TeleportHandler(mapNodeRepository.gameMap).subscribe();
    new AddInventoryHandler().subscribe();
    new EquipItemHandler().subscribe();
    new ConjureItemHandler(itemRepository).subscribe();
    new StartGameHandler(repositorySet).subscribe();
    new StopGameHandler().subscribe();
    new ListInventoryHandler().subscribe();

    new HelpHandler(gameDefinitionRepository).subscribe();
  }
}
