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

    const moveParser = new MoveParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'move north\'.', () => {
      const command = moveParser.parse('move north');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'north\'.', () => {
      const command = moveParser.parse('north');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'n\'.', () => {
      const command = moveParser.parse('n');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'s\'.', () => {
      const command = moveParser.parse('s');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'e\'.', () => {
      const command = moveParser.parse('e');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'w\'.', () => {
      const command = moveParser.parse('w');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'u\'.', () => {
      const command = moveParser.parse('u');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'d\'.', () => {
      const command = moveParser.parse('d');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'GO DOWN\'.', () => {
      const command = moveParser.parse('GO DOWN');

      expect(command).to.not.be.null;
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = moveParser.parse('dummy');

      expect(command).to.be.null;
    });
  });
});