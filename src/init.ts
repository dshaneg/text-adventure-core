import { TextAdventureCore as Core } from './index';

// repositories
const gameDefinitionRepository = new Core.defaultImplementations.GameDefinitionRepository();
const mapNodeRepository = new Core.defaultImplementations.MapNodeRepository();
const itemRepository = new Core.defaultImplementations.ItemRepository();

const gameSessionRepository = new Core.defaultImplementations.GameSessionRepositoryMem();

const gameState = Core.createGameManager(gameSessionRepository).createGame();
const gameEngine = Core.createGameEngine(gameDefinitionRepository, mapNodeRepository, itemRepository, true);

let response = gameEngine.startGame(gameState);
console.log(JSON.stringify(response, null, 2));

response = gameEngine.handleInput(gameState, 'go south');
console.log(JSON.stringify(response, null, 2));

response = gameEngine.handleInput(gameState, 'conjureitem 1002');
console.log(JSON.stringify(response, null, 2));

response = gameEngine.handleInput(gameState, 'exit');
console.log(JSON.stringify(response, null, 2));

response = gameEngine.handleInput(gameState, 'force stop game');
console.log(JSON.stringify(response, null, 2));
