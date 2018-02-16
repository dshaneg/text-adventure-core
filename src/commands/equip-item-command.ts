'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../domain/voice';
import { GameState } from '../state/game-state';

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

  execute(gameState: GameState, addEvent: AddEventCall, silent: boolean = false): void {
    gameState.equip(this.item);

    addEvent({
      topic: 'player.inventory.item-equipped',
      message: `You equip the ${this.item.name}.`,
      voice: this.silent ? Voice.mute : Voice.gamemaster,
      item: this.item
    });
  }
}
