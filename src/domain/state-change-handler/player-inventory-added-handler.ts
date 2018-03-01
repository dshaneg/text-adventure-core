import { StateChangeHandler } from './state-change-handler';
import { GameState } from '../../state/game-state';

export class PlayerInventoryAddedHandler implements StateChangeHandler {
  public handles(event: any): boolean {
    return event.topic === 'player.inventory.added';
  }

  public handle(event: any, gameState: GameState): void {
    gameState.addInventory(event.item, event.count);
  }
}
