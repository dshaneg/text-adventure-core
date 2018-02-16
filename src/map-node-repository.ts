'use strict';

import { GameMap } from './domain/game-map';

export interface MapNodeRepository {
  getMap(): GameMap;
}

