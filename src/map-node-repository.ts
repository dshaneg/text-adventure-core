'use strict';

import { GameMap } from './game-map';

export interface MapNodeRepository {
  getMap(): GameMap;
}

