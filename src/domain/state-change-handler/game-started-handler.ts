import { StateChangeHandler } from './state-change-handler';
import { GameState } from '../../state/game-state';

export class GameStartedHandler implements StateChangeHandler {
  public handles(event: any): boolean {
    return event.topic === 'game.started';
  }

  public handle(event: any, gameState: GameState): void {
    gameState.start();
  }
}
