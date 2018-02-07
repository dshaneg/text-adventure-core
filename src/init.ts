import { gameManager, gameEngine } from './index';

const sessionToken = gameManager.createGame();

console.log(sessionToken);