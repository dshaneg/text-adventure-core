'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { GameState } from '../../state/game-state';
import { Publisher } from '../../domain/event-publisher';
import { Voice } from '../../domain/voice';

import { StopGameCommand } from '../../commands/stop-game-command';

describe('StopGameCommand', () => {
  describe('execute', () => {
    // mock GameState
    const GameStateMock = mockito.mock(GameState);
    const gameState = mockito.instance(GameStateMock);

    // mock the EventPublisher
    const EventPublisherMock = mockito.mock(Publisher);
    const publisher = mockito.instance(EventPublisherMock);

    beforeEach(() => {
      mockito.reset(GameStateMock);

      mockito.resetCalls(EventPublisherMock);
    });

    describe('Force Stop', () => {
      let command: StopGameCommand;

      beforeEach(() => {
        command = new StopGameCommand(true);
        command.execute(gameState, publisher);
      });

      it('Should publish only one event.', () => {
        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish game.stopped event.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'game.stopped',
          message: 'See you next time.',
          voice: Voice.gamemaster
        };

        expect(event).to.deep.equal(expectedEvent);
      });

      it('Should execute stop on gameState.', () => {
        mockito.verify(GameStateMock.stop()).once();
      });
    });

    describe('Request Stop', () => {
      let command: StopGameCommand;

      beforeEach(() => {
        command = new StopGameCommand(false);
        command.execute(gameState, publisher);
      });

      it('Should publish only one event.', () => {
        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish game.stop-requested event.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'game.stop-requested'
        };

        expect(event).to.deep.equal(expectedEvent);
      });

      it('Should not execute stop on gameState.', () => {
        mockito.verify(GameStateMock.stop()).never();
      });
    });
  });
});