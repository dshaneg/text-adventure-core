import { StateChangeHandler } from './state-change-handler';
import { GameState } from '../../state/game-state';

export class PlayerInventoryEquippedHandler implements StateChangeHandler {
  public handles(event: any): boolean {
    return event.topic === 'player.inventory.equipped';
  }

  public handle(event: any, gameState: GameState): void {
    gameState.equip(event.item);
  }
}
