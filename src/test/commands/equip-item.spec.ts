'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { GameState } from '../../state/game-state';
import { Publisher } from '../../domain/event-publisher';
import { Voice } from '../../domain/voice';

import { EquipItemCommand } from '../../commands/equip-item-command';

describe('EquipItemCommand', () => {
  describe('execute', () => {
    const GameStateMock = mockito.mock(GameState);
    const gameState = mockito.instance(GameStateMock);

    const EventPublisherMock = mockito.mock(Publisher);
    const publisher = mockito.instance(EventPublisherMock);

    beforeEach(() => {
      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(GameStateMock);
    });

    describe('Happy Path', () => {
      const item = { id: 1, name: 'butter knife' };
      let command: EquipItemCommand;

      beforeEach(() => {
        command = new EquipItemCommand(item);
      });

      it('Should call gs.equip once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.equip(item)).once();
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should call publisher player.inventory.item-equipped event.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.item-equipped');
        expect(event.message).not.to.be.empty;
        expect(event.item).to.equal(item);
        expect(event.voice).to.equal(Voice.gamemaster);
      });
    });

    describe('Happy Path, Silent Mode', () => {
      const item = { id: 1, name: 'butter knife' };
      let command: EquipItemCommand;

      beforeEach(() => {
        command = new EquipItemCommand(item, true);
      });

      it('Should call gs.equip once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(GameStateMock.equip(item)).once();
      });

      it('Should call publisher.publish once.', () => {
        command.execute(gameState, publisher);

        mockito.verify(EventPublisherMock.publish(mockito.anything())).once();
      });

      it('Should call publisher player.inventory.item-equipped event with mute voice.', () => {
        command.execute(gameState, publisher);

        const [event] = mockito.capture(EventPublisherMock.publish).first();
        expect(event.topic).to.equal('player.inventory.item-equipped');
        expect(event.message).not.to.be.empty;
        expect(event.item).to.equal(item);
        expect(event.voice).to.equal(Voice.mute);
      });
    });
  });
});