'use strict';

import { GameDefinitionRepository, GameDefinition } from '../game-definition-repository';

const gameDefinitionRaw = require('../../game/game');

export class GameDefinitionRepositoryDefault implements GameDefinitionRepository {
  private _gameDefinition: GameDefinition;

  getGameDefinition(): GameDefinition {
    if (!this._gameDefinition) {
      this._gameDefinition = createGameDefinition(gameDefinitionRaw);
    }
    return this._gameDefinition;
  }
}

function createGameDefinition(definition: any) {
  const def = {
    banner: definition.banner.join('\n'),
    opening: definition.opening.join('\n'),
    help: definition.help.join('\n')
  };

  return def;
}

