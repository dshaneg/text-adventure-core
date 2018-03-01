import { GameState } from '../../state/game-state';

export interface StateChangeHandler {
  handles(event: any): boolean;
  handle(event: any, gameState: GameState): void;
}