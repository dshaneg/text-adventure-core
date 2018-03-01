import { StateChangeHandler } from './state-change-handler';
import { GameState } from '../../state/game-state';

export class GameStoppedHandler implements StateChangeHandler {
  public handles(event: any): boolean {
    return event.topic === 'game.stopped';
  }

  public handle(event: any, gameState: GameState): void {
    gameState.stop();
  }
}
