'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { GameState } from '../../state/game-state';
import { Publisher } from '../../domain/event-publisher';
import { Voice } from '../../domain/voice';

import { AddInventoryCommand } from '../../commands/add-inventory-command';

describe('AddInventoryCommand', () => {
  describe('constructor', () => {
    describe('Item with no name', () => {
      const item = { id: 1 };
      const delta = { item, count: 1 };
      const deltas = [ delta ];

      it('should throw error.', () => {
      expect(() => { new AddInventoryCommand(deltas); }).to.throw(/^Bad item definition: .*/);
      });
    });
  });

  describe('addDelta', () => {
    describe('Item with no name', () => {
      const item = { id: 1 };
      const delta = { item, count: 1 };
      const deltas = [ delta ];

      it('should throw error.', () => {
        const command = new AddInventoryCommand([]);
        expect(() => { command.addDelta(item, 1); }).to.throw(/^Bad item definition: .*/);
      });
    });
  });

  describe('execute', () => {
    const GameStateMock = mockito.mock(GameState);
    const gameState = mockito.instance(GameStateMock);

    const EventPublisherMock = mockito.mock(Publisher);
    const publisher = mockito.instance(EventPublisherMock);

      beforeEach(() => {
      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(GameStateMock);
    });

    describe('Happy Path, Single item', () => {
      const item = { id: 1, name: 'butter knife' };
      const delta = { item, count: 1 };
      const deltas = [ delta ];
      let command: AddInventoryCommand;

      beforeEach(() => {
        command = new AddInventoryCommand(deltas);
      });

      it('Should call gs.addinventory once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.addInventory(item, 1)).once();
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();

        const [ event ] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.added');
        expect(event.message).not.to.be.empty;
        expect(event.item).to.equal(item);
        expect(event.count).to.equal(1);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });

    describe('Happy Path, Silent mode', () => {
      const item = { id: 1, name: 'butter knife' };
      const delta = { item, count: 1 };
      const deltas = [ delta ];
      let command: AddInventoryCommand;

      beforeEach(() => {
        command = new AddInventoryCommand(deltas, true);
      });

      it('Should call gs.addinventory once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.addInventory(item, 1)).once();
      });

      it('Should call publisher.publish once with mute voice.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();

        const [ event ] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.voice).to.equal(Voice.mute);
      });
    });

    describe('Happy Path, two items', () => {
      const item1 = { id: 1, name: 'fork' };
      const item2 = { id: 1, name: 'spoon' };
      const delta1 = { item: item1, count: 5 };
      const delta2 = { item: item2, count: 5 };
      const deltas = [ delta1, delta2 ];
      let command: AddInventoryCommand;

      beforeEach(() => {
        command = new AddInventoryCommand(deltas);
      });

      it('Should call gs.addinventory twice.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.addInventory(item1, 5)).once();
        mockito.verify(GameStateMock.addInventory(item2, 5)).once();
      });

      it('Should call publisher.publish twice.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).twice();

        const [ event1 ] = mockito.capture(EventPublisherMock.publish).first();
        expect(event1.topic).to.equal('player.inventory.added');
        expect(event1.message).not.to.be.empty;
        expect(event1.item).to.equal(item1);
        expect(event1.count).to.equal(5);
        expect(event1.voice).to.equal(Voice.gamemaster);

        const [ event2 ] = mockito.capture(EventPublisherMock.publish).second();
        expect(event2.topic).to.equal('player.inventory.added');
        expect(event2.message).not.to.be.empty;
        expect(event2.item).to.equal(item2);
        expect(event2.count).to.equal(5);
        expect(event2.voice).to.equal(Voice.gamemaster);
      });
    });

    describe('Single item, 0 count', () => {
      const item = { id: 1, name: 'butter knife' };
      const delta = { item, count: 0 };
      const deltas = [ delta ];
      let command: AddInventoryCommand;

      beforeEach(() => {
        command = new AddInventoryCommand(deltas);
      });

      it('Should call gs.addinventory once with 0 as count.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.addInventory(item, 0)).once();
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();

        const [ event ] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.added');
        expect(event.message).not.to.be.empty;
        expect(event.item).to.equal(item);
        expect(event.count).to.equal(0);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });

    describe('Happy Path, no constructor item, addDelta called', () => {
      const item = { id: 1, name: 'butter knife' };
      let command: AddInventoryCommand;

      beforeEach(() => {
        command = new AddInventoryCommand([]);
        command.addDelta(item, 1);
      });

      it('Should call gs.addinventory once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.addInventory(item, 1)).once();
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();

        const [ event ] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.added');
        expect(event.message).not.to.be.empty;
        expect(event.item).to.equal(item);
        expect(event.count).to.equal(1);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });
  });
});