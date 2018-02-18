'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { GameState } from '../../state/game-state';
import { EventPublisher } from '../../domain/event-publisher';
import { EventQueue } from '../../event-queue';
import { Voice } from '../../domain/voice';

import { ListInventoryCommand } from '../../commands/list-inventory-command';

describe('ListInventoryCommand', () => {
  describe('execute', () => {
    const GameStateMock = mockito.mock(GameState);
    let gameState: GameState;

    const EventPublisherMock = mockito.mock(EventQueue);
    const publisher = mockito.instance(EventPublisherMock);

    beforeEach(() => {
      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(GameStateMock);
    });

    describe('Happy Path, Single item', () => {
      const inventory = [
        { item: { id: 1, text: 'butter knife' }, count: 1 }
      ];
      let command: ListInventoryCommand;

      beforeEach(() => {
        command = new ListInventoryCommand();

        mockito.when(GameStateMock.queryInventory()).thenReturn(inventory);
        gameState = mockito.instance(GameStateMock);
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish player.inventory.list-requested event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.list-requested');
        expect(event.message).not.to.be.empty;
        expect(event.items).to.equal(inventory);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });

    describe('Two items in inventory', () => {
      const inventory = [
        { item: { id: 1, text: 'butter knife' }, count: 1 },
        { item: { id: 2, text: 'fork' }, count: 1 }
      ];
      let command: ListInventoryCommand;

      beforeEach(() => {
        command = new ListInventoryCommand();

        mockito.when(GameStateMock.queryInventory()).thenReturn(inventory);
        gameState = mockito.instance(GameStateMock);
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish player.inventory.list-requested event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.list-requested');
        expect(event.message).not.to.be.empty;
        expect(event.items).to.equal(inventory);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });

    describe('No items in inventory', () => {
      const inventory: any[] = [];
      let command: ListInventoryCommand;

      beforeEach(() => {
        command = new ListInventoryCommand();

        mockito.when(GameStateMock.queryInventory()).thenReturn(inventory);
        gameState = mockito.instance(GameStateMock);
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish "empty" player.inventory.list-requested event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.list-requested');
        expect(event.message).to.equal('Inventory is empty.');
        expect(event.items).to.equal(inventory);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });
  });
});