import { TextAdventureCore, Parser, Command, EventPublisher, GameState, Voice } from '../index';

// repositories
const gameDefinitionRepository = new TextAdventureCore.defaultImplementations.GameDefinitionRepository();
const mapNodeRepository = new TextAdventureCore.defaultImplementations.MapNodeRepository();
const itemRepository = new TextAdventureCore.defaultImplementations.ItemRepository();

const gameSessionRepository = new TextAdventureCore.defaultImplementations.GameSessionRepository();

class HelloCommand implements Command {
  execute(gameState: GameState, publisher: EventPublisher): void {
    publisher.publish({ topic: 'client', message: 'hello', voice: Voice.gamemaster });
  }
}

class HelloParser extends Parser {
  parseInput(input: string): Command {
    if (input === 'hello') {
      return new HelloCommand();
    }
  }
}

const gameState = TextAdventureCore.createGameManager(gameSessionRepository).createGame();
const gameEngine = TextAdventureCore.createGameEngine(gameDefinitionRepository, mapNodeRepository, itemRepository, new HelloParser(), true);

let response = gameEngine.startGame(gameState);
debug(response);

response = gameEngine.handleInput(gameState, 'go south');
debug(response);

response = gameEngine.handleInput(gameState, 'hello');
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