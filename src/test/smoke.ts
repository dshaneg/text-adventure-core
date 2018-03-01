import { expect } from 'chai';
import 'mocha';

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

const gameEngine = TextAdventureCore.createGameEngine(gameDefinitionRepository, mapNodeRepository, itemRepository, new HelloParser(), true);

describe('Sequential Smoke Tests', () => {

  const gameState = TextAdventureCore.createGameManager(gameSessionRepository).createGame();

  it('start the game', () => {
    const response = gameEngine.startGame(gameState);
    debug(response);
    expect(response.events).to.have.lengthOf(9);
  });

  it('go south', () => {
    const response = gameEngine.handleInput(gameState, 'go south');
    debug(response);
    expect(response.events).to.have.lengthOf(1);
  });

  it('client event', () => {
    const response = gameEngine.handleInput(gameState, 'hello');
    debug(response);
    expect(response.events).to.have.lengthOf(1);
  });

  it('conjure up Excaliboar', () => {
    const response = gameEngine.handleInput(gameState, 'conjureitem 1002');
    debug(response);
    expect(response.events).to.have.lengthOf(2);
  });

  it('get help', () => {
    const response = gameEngine.handleInput(gameState, 'help');
    debug(response);

    expect(response.events).to.have.lengthOf(1);
  });

  it('get inventory', () => {
    const response = gameEngine.handleInput(gameState, 'inventory');
    debug(response);
    expect(response.events).to.have.lengthOf(1);
  });

  it('exit', () => {
    const response = gameEngine.handleInput(gameState, 'exit');
    debug(response);
    expect(response.events).to.have.lengthOf(1);
  });

  it('force stop', () => {
    const response = gameEngine.stopGame(gameState);
    debug(response);
    expect(response.events).to.have.lengthOf(1);
  });
});

describe('Replay Tests', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = TextAdventureCore.createGameManager(gameSessionRepository).createGame();
  });

  it('replay should reproduce same state as original play', () => {
    const events: any[] = gameEngine.startGame(gameState).events
      .concat(gameEngine.handleInput(gameState, 'go south').events)
      .concat(gameEngine.handleInput(gameState, 'go south').events)
      .concat(gameEngine.handleInput(gameState, 'go south').events)
      .concat(gameEngine.handleInput(gameState, 'hello').events)
      .concat(gameEngine.handleInput(gameState, 'conjureitem 1002').events)
      .concat(gameEngine.handleInput(gameState, 'help').events)
      .concat(gameEngine.handleInput(gameState, 'inventory').events)
      .concat(gameEngine.handleInput(gameState, 'exit').events)
      .concat(gameEngine.stopGame(gameState).events);

    const newState = TextAdventureCore.createGameManager(gameSessionRepository).createGame();
    gameEngine.replayEvents(newState, events);

    expect(newState.player).to.deep.equal(gameState.player);
    expect(newState.isStarted).to.equal(gameState.isStarted);
  });
});

function debug(response: any) {
  console.log('==============================================');
  console.log(`input: ${response.command}`);
  response.events.forEach((event: any) => {
    console.log(JSON.stringify(event, null));
  });
}