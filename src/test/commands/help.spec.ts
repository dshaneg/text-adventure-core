'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { GameState } from '../../state/game-state';
import { EventPublisher } from '../../domain/event-publisher';
import { EventQueue } from '../../event-queue';
import { Voice } from '../../domain/voice';
import { GameDefinitionRepository, GameDefinition } from '../../game-definition-repository';
import { GameDefinitionRepositoryDefault } from '../../impl/game-definition-repository-default';

import { HelpCommand } from '../../commands/help-command';

describe('HelpCommand', () => {
  describe('execute', () => {
    const GameStateMock = mockito.mock(GameState);
    const gameState = mockito.instance(GameStateMock);

    const EventPublisherMock = mockito.mock(EventQueue);
    const publisher = mockito.instance(EventPublisherMock);

    const gameDefinition: GameDefinition = {
      banner: null,
      opening: null,
      help: 'help text'
    };
    const GameDefinitionRepositoryMock = mockito.mock(GameDefinitionRepositoryDefault);
    mockito
      .when(GameDefinitionRepositoryMock.getGameDefinition())
      .thenReturn(gameDefinition);
    const gameDefinitionRepository = mockito.instance(GameDefinitionRepositoryMock);

    beforeEach(() => {
      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(GameStateMock);
    });

    describe('Happy Path', () => {
      let command: HelpCommand;

      beforeEach(() => {
        command = new HelpCommand(gameDefinitionRepository);
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should call publisher game.help-requested event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('game.help-requested');
        expect(event.message).to.equal(gameDefinition.help);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });
  });
});