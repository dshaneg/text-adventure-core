'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { CommandFactory } from '../../commands/command-factory';
import { ItemRepositoryDefault } from '../../impl/item-repository-default';

import { GameState } from '../../state/game-state';
import { Publisher } from '../../domain/event-publisher';
import { Voice } from '../../domain/voice';

import { ConjureItemCommand } from '../../commands/conjure-item-command';
import { AddInventoryCommand } from '../../commands/add-inventory-command';

describe('ConjureItemCommand', () => {
  describe('execute', () => {
    const gameState = mockito.instance(mockito.mock(GameState));

    const EventPublisherMock = mockito.mock(Publisher);
    const publisher = mockito.instance(EventPublisherMock);

    const ItemRepositoryMock = mockito.mock(ItemRepositoryDefault);
    const CommandFactoryMock = mockito.mock(CommandFactory);
    const AddInventoryCommandMock = mockito.mock(AddInventoryCommand);

    beforeEach(() => {
      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(AddInventoryCommandMock);

      mockito.reset(CommandFactoryMock);
      mockito.reset(ItemRepositoryMock);
    });

    describe('Happy Path', () => {
      const item = { id: 1, name: 'butter knife' };
      const delta = { item, count: 1 };
      const deltas = [delta];
      let command: ConjureItemCommand;

      beforeEach(() => {
        mockito
          .when(ItemRepositoryMock.get(mockito.anyNumber()))
          .thenReturn(item);
        const itemRepository = mockito.instance(ItemRepositoryMock);

        const addInventoryCommand = mockito.instance(AddInventoryCommandMock);
        mockito
          .when(CommandFactoryMock.createAddInventoryCommand(mockito.anything()))
          .thenReturn(addInventoryCommand);
        const commandFactory = mockito.instance(CommandFactoryMock);

        command = new ConjureItemCommand(commandFactory, itemRepository, delta.item.id, delta.count);
      });

      it('Should publish 1 event.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should publish item.conjured event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('item.conjured');
        expect(event.message).not.to.be.empty;
        expect(event.item).to.equal(delta.item);
        expect(event.count).to.equal(delta.count);
        expect(event.voice).to.equal(Voice.bard);
        expect(event.target).to.equal('inventory');
      });

      it('Should use commandfactory to create AddInventoryCommand.', () => {
        command.execute(gameState, publisher);

        mockito.verify(CommandFactoryMock.createAddInventoryCommand(mockito.anything())).once();
        const [passedDelta] = mockito.capture(CommandFactoryMock.createAddInventoryCommand).first();
        expect(passedDelta).to.have.lengthOf(1);
        expect(passedDelta[0].item.id).to.equal(item.id);
        expect(passedDelta[0].item.name).to.equal(item.name);
        expect(passedDelta[0].count).to.equal(1);
      });

      it('Should execute AddInventoryCommand.', () => {
        command.execute(gameState, publisher);

        mockito.verify(AddInventoryCommandMock.execute(gameState, publisher)).once();
      });
    });

    describe('Default count', () => {
      const item = { id: 1, name: 'butter knife' };
      const delta = { item, count: 1 };
      const deltas = [delta];
      let command: ConjureItemCommand;

      beforeEach(() => {
        mockito
          .when(ItemRepositoryMock.get(mockito.anyNumber()))
          .thenReturn(item);
        const itemRepository = mockito.instance(ItemRepositoryMock);

        const addInventoryCommand = mockito.instance(AddInventoryCommandMock);
        mockito
          .when(CommandFactoryMock.createAddInventoryCommand(mockito.anything()))
          .thenReturn(addInventoryCommand);
        const commandFactory = mockito.instance(CommandFactoryMock);

        // make the call without specifying the count
        command = new ConjureItemCommand(commandFactory, itemRepository, delta.item.id);
      });

      it('Should publish item.conjured event with count of 1.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('item.conjured');
        expect(event.count).to.equal(1);
      });

      it('Should create AddInventoryCommand with count of 1.', () => {
        command.execute(gameState, publisher);

        mockito.verify(CommandFactoryMock.createAddInventoryCommand(mockito.anything())).once();
        const [passedDelta] = mockito.capture(CommandFactoryMock.createAddInventoryCommand).first();
        expect(passedDelta[0].count).to.equal(1);
      });
    });

    describe('Item id not found', () => {
      const item = { id: 1, name: 'butter knife' };
      const delta = { item, count: 1 };
      const deltas = [delta];
      let command: ConjureItemCommand;

      beforeEach(() => {
        mockito
          .when(ItemRepositoryMock.get(mockito.anyNumber()))
          .thenReturn(undefined);
        const itemRepository = mockito.instance(ItemRepositoryMock);

        const addInventoryCommand = mockito.instance(AddInventoryCommandMock);
        mockito
          .when(CommandFactoryMock.createAddInventoryCommand(mockito.anything()))
          .thenReturn(addInventoryCommand);
        const commandFactory = mockito.instance(CommandFactoryMock);

        command = new ConjureItemCommand(commandFactory, itemRepository, delta.item.id, delta.count);
      });

      it('Should publish only 1 event.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });


      it('Should publish error event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('error');
        expect(event.message).not.to.be.empty;
        expect(event.voice).to.equal(Voice.warden);
      });

      it('Should NOT use commandfactory to create AddInventoryCommand.', () => {
        command.execute(gameState, publisher);

        mockito.verify(CommandFactoryMock.createAddInventoryCommand(mockito.anything())).never();
      });
    });
  });
});