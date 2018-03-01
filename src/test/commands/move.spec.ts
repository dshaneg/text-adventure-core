'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { GameState } from '../../state/game-state';
import { Publisher } from '../../domain/event-publisher';
import { Voice } from '../../domain/voice';
import { MapNode } from '../../domain/map-node';

import { MoveCommand } from '../../commands/move-command';

describe('MoveCommand', () => {
  describe('execute', () => {
    const GameStateMock = mockito.mock(GameState);
    let gameState: GameState;

    const EventPublisherMock = mockito.mock(Publisher);
    const publisher = mockito.instance(EventPublisherMock);

    beforeEach(() => {
      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(GameStateMock);
    });

    describe('Happy Path, Move north', () => {
      const direction = 'n';
      let command: MoveCommand;

      const startNodeConfig = {
        id: 1,
        name: 'start',
        description: ['starting node'],
        location: { x: 0, y: 0, z: 0 },
      };
      const startNode = new MapNode(startNodeConfig);

      const endNodeConfig = {
        id: 2,
        name: 'end',
        description: ['ending node', 'line two'],
        location: { x: 0, y: -1, z: 0 },
      };
      const endNode = new MapNode(endNodeConfig);

      beforeEach(() => {
        command = new MoveCommand('n');

        mockito.reset(GameStateMock);

        mockito.when(GameStateMock.tryMove(direction)).thenReturn(true);
        mockito.when(GameStateMock.queryCurrentNode())
          .thenReturn(startNode)
          .thenReturn(endNode);

        gameState = mockito.instance(GameStateMock);
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish player.location.moved event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'player.location.moved',
          message: 'ending node\nline two',
          voice: Voice.bard,
          previousNode: {
            id: startNodeConfig.id,
            name: startNodeConfig.name,
            location: startNodeConfig.location
          },
          currentNode: {
            id: endNodeConfig.id,
            name: endNodeConfig.name,
            location: endNodeConfig.location
          },
          direction: 'north'
        };

        expect(event).to.deep.equal(expectedEvent);
      });
    });

    describe('Blocked move', () => {
      const direction = 'u';
      let command: MoveCommand;

      const startNodeConfig = {
        id: 1,
        name: 'start',
        description: ['starting node'],
        location: { x: 0, y: 0, z: 0 },
      };
      const startNode = new MapNode(startNodeConfig);

      beforeEach(() => {
        command = new MoveCommand('u');

        mockito.reset(GameStateMock);

        mockito.when(GameStateMock.tryMove(direction)).thenReturn(false);
        mockito.when(GameStateMock.queryCurrentNode()).thenReturn(startNode);

        gameState = mockito.instance(GameStateMock);
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish player.location.move-blocked event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'player.location.move-blocked',
          message: 'The way up is not for you to travel.',
          voice: Voice.gamemaster,
          currentNode: {
            id: startNodeConfig.id,
            name: startNodeConfig.name,
            location: startNodeConfig.location
          },
          direction: 'up'
        };

        expect(event).to.deep.equal(expectedEvent);
      });
    });
  });
});