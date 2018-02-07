'use strict';

// import { CommandHandler } from './command-handler';
// import { commandChannel, eventChannel } from '../message-bus';
import { CreateGameCommand } from '../commands/create-game-command';
import { GameSessionRepository } from '../game-session-repository';

export class CreateGameHandler { // extends CommandHandler {
  constructor(gameSessionRepository: GameSessionRepository) {
    // super();
    this.gameSessionRepository = gameSessionRepository;
  }

  private gameSessionRepository: GameSessionRepository;

  // subscribeToTopic() {
  //   commandChannel.subscribe(CreateGameCommand.topic, () => this.handle());
  // }

  handle(): string {
    // try {
    const sessionToken = this.gameSessionRepository.create();

    return sessionToken;

    //   eventChannel.publish({
    //     topic: 'game.created',
    //     data: { sessionToken }
    //   });
    // } catch (error) {
    //   eventChannel.publish({
    //     topic: 'error',
    //     data: error
    //   });
    // }
  }
}

