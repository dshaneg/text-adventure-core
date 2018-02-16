import { TextAdventureCore as Core } from '../index';

// repositories
const gameDefinitionRepository = new Core.defaultImplementations.GameDefinitionRepository();
const mapNodeRepository = new Core.defaultImplementations.MapNodeRepository();
const itemRepository = new Core.defaultImplementations.ItemRepository();

const gameSessionRepository = new Core.defaultImplementations.GameSessionRepositoryMem();

const gameState = Core.createGameManager(gameSessionRepository).createGame();
const gameEngine = Core.createGameEngine(gameDefinitionRepository, mapNodeRepository, itemRepository, true);

let response = gameEngine.startGame(gameState);
debug(response);

response = gameEngine.handleInput(gameState, 'go south');
debug(response);

response = gameEngine.handleInput(gameState, 'conjureitem 1002');
debug(response);

response = gameEngine.handleInput(gameState, 'help');
debug(response);

response = gameEngine.handleInput(gameState, 'inventory');
debug(response);

response = gameEngine.handleInput(gameState, 'exit');
debug(response);

response = gameEngine.handleInput(gameState, 'force stop game');
debug(response);

function debug(response: any) {
  console.log('==============================================');
  console.log(`input: ${response.command}`);
  response.events.forEach((event: any) => {
    console.log(JSON.stringify(event, null));
  });
}