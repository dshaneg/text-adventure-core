'use strict';

import { GameSessionRepositoryMem } from './game-session-repository-mem';

import { GameDefinitionRepository } from './game-definition-repository';
import { MapNodeRepository } from './map-node-repository';
import { ItemRepository } from './item-repository';

import { CommandFactory } from './commands/command-factory';

import { GameManager } from './game-manager';
import { GameEngine } from './game-engine';

// repositories
const itemRepository = new ItemRepository();
const mapNodeRepository = new MapNodeRepository();
const gameDefinitionRepository = new GameDefinitionRepository();
const gameSessionRepository = new GameSessionRepositoryMem();

const commandFactory = new CommandFactory(itemRepository, gameSessionRepository, gameDefinitionRepository, mapNodeRepository);

export const gameManager = new GameManager(gameSessionRepository);
export const gameEngine = new GameEngine(commandFactory);
