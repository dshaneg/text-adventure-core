import { TextAdventureCore as Core } from './index';

// repositories
const gameDefinitionRepository = new Core.defaultImplementations.GameDefinitionRepository();
const mapNodeRepository = new Core.defaultImplementations.MapNodeRepository();
const itemRepository = new Core.defaultImplementations.ItemRepository();

const gameSessionRepository = new Core.defaultImplementations.GameSessionRepositoryMem();

const gameState = Core.createGameManager(gameSessionRepository).createGame();
console.log(gameState);

const gameEngine = Core.createGameEngine(gameDefinitionRepository, mapNodeRepository, itemRepository, true);
let response = gameEngine.startGame(gameState);
console.log(response);

response = gameEngine.handleInput(gameState, 'go south');
console.log(response);
