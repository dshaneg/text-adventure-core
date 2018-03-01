'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { MapNodeRepositoryDefault } from '../../impl/map-node-repository-default';
import { GameMap } from '../../domain/game-map';
import { MapNode } from '../../domain/map-node';
import { GameState } from '../../state/game-state';
import { Publisher } from '../../domain/event-publisher';
import { Voice } from '../../domain/voice';

import { TeleportCommand } from '../../commands/teleport-command';

describe('TeleportCommand', () => {
  describe('execute', () => {
    // set up the gamemap
    const entryNodeConfig = {
      id: 1,
      name: 'entry',
      description: ['entry node'],
      location: { x: 0, y: 0, z: 0 }
    };
    const entryNode: MapNode = new MapNode(entryNodeConfig);
    const targetNodeConfig = {
      id: 2,
      name: 'target',
      description: ['target node'],
      location: { x: 1, y: 1, z: 1 }
    };
    const targetNode: MapNode = new MapNode(targetNodeConfig);
    const nodeMap = new Map<number, MapNode>();
    nodeMap.set(entryNode.id, entryNode);
    nodeMap.set(targetNode.id, targetNode);

    const gameMap: GameMap = new GameMap(nodeMap, entryNode.id);

    // mock GameState
    const GameStateMock = mockito.mock(GameState);
    let gameState: GameState;

    // mock the EventPublisher
    const EventPublisherMock = mockito.mock(Publisher);
    const publisher = mockito.instance(EventPublisherMock);

    beforeEach(() => {
      mockito.reset(GameStateMock);
      mockito.resetCalls(EventPublisherMock);
    });

    describe('Happy Path', () => {
      let command: TeleportCommand;

      beforeEach(() => {
        command = new TeleportCommand(gameMap, targetNodeConfig.id);

        mockito.when(GameStateMock.queryCurrentNode())
          .thenReturn(entryNode)
          .thenReturn(targetNode);

        gameState = mockito.instance(GameStateMock);

        command.execute(gameState, publisher);
      });

      it('Should publish 2 events.', () => {
        mockito.verify(EventPublisherMock.publish(mockito.anything())).twice();
      });

      it('Should publish player.location.teleporting event first.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'player.location.teleporting',
          message: 'Your eyesight begins to swim and you feel a strong tug at the base of your stomach...',
          voice: Voice.bard
        };

        expect(event).to.deep.equal(expectedEvent);
      });

      it('Should publish player.location.moved event second.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).second();

        const expectedEvent = {
          topic: 'player.location.moved',
          message: targetNode.description,
          voice: Voice.bard,
          previousNode: { id: entryNode.id, name: entryNode.name, location: entryNode.location },
          currentNode: { id: targetNode.id, name: targetNode.name, location: targetNode.location },
          direction: 'teleport'
        };

        expect(event).to.deep.equal(expectedEvent);
      });
    });

    describe('Target node does not exist', () => {
      let command: TeleportCommand;

      beforeEach(() => {
        // try to teleport to a node id that isn't in the map
        command = new TeleportCommand(gameMap, 99);

        mockito.when(GameStateMock.queryCurrentNode())
          .thenReturn(entryNode);

        gameState = mockito.instance(GameStateMock);

        command.execute(gameState, publisher);
      });

      it('Should publish 1 event.', () => {
        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish error event.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'error',
          message: 'Could not teleport. No node with id 99.',
          voice: Voice.warden
        };

        expect(event).to.deep.equal(expectedEvent);
      });
    });
  });
});