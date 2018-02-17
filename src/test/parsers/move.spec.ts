'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { MoveCommand } from '../../commands/move-command';
import { CommandFactory } from '../../commands/command-factory';

import { MoveParser } from '../../parsers/move-parser';

describe('MoveParser', () => {
  describe('parseInput', () => {
    const CommandFactoryMock = mockito.mock(CommandFactory);
    mockito.when(CommandFactoryMock.createMoveCommand(mockito.anyString()))
      .thenReturn(new MoveCommand('n'));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new MoveParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'move north\'.', () => {
      const command = parser.parse('move north');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('n')).once();
    });

    it('Should return a command when input is \'north\'.', () => {
      const command = parser.parse('north');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('n')).once();
    });

    it('Should return a command when input is \'n\'.', () => {
      const command = parser.parse('n');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('n')).once();
    });

    it('Should return a command when input is \'s\'.', () => {
      const command = parser.parse('s');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('s')).once();
    });

    it('Should return a command when input is \'e\'.', () => {
      const command = parser.parse('e');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('e')).once();
    });

    it('Should return a command when input is \'w\'.', () => {
      const command = parser.parse('w');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('w')).once();
    });

    it('Should return a command when input is \'u\'.', () => {
      const command = parser.parse('u');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('u')).once();
    });

    it('Should return a command when input is \'d\'.', () => {
      const command = parser.parse('d');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('d')).once();
    });

    it('Should return a command when input is \'GO DOWN\'.', () => {
      const command = parser.parse('GO DOWN');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand('d')).once();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand(mockito.anything())).never();
    });

    it('Should return null when input is empty.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand(mockito.anything())).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createMoveCommand(mockito.anything())).never();
    });
  });
});