import { StateChangeHandler } from './state-change-handler';
import { GameState } from '../../state/game-state';
import { MapNodeRepository } from '../../map-node-repository';

export class PlayerLocationMovedHandler implements StateChangeHandler {
  constructor(private mapNodeRepository: MapNodeRepository) {}

  public handles(event: any): boolean {
    return event.topic === 'player.location.moved';
  }

  public handle(event: any, gameState: GameState): void {
    const targetNode = this.mapNodeRepository.getMap().get(event.currentNode.id);
    gameState.setCurrentLocation(targetNode);
  }
}
