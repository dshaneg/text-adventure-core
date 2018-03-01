'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { ReadOnlyGameState } from '../state/game-state';

const topic = 'player.inventory.equip-item';

/** Class representing a command instructing the game equip an item on the player.
 */
export class EquipItemCommand implements Command {

  /**
   * Create an instance of EquipItemCommand.
   */
  constructor(
    private item: any,
    private silent: boolean = false) {
  }

  execute(gameState: ReadOnlyGameState, publisher: EventPublisher, silent: boolean = false): void {
    publisher.publish({
      topic: 'player.inventory.item-equipped',
      message: `You equip the ${this.item.name}.`,
      voice: this.silent ? Voice.mute : Voice.gamemaster,
      item: this.item
    });
  }
}
