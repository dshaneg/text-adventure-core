'use strict';

export type GameDefinition = { banner: string, opening: string, help: string };

export interface GameDefinitionRepository {
  getGameDefinition(): GameDefinition;
}
