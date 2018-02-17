'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { HelpCommand } from '../../commands/help-command';
import { CommandFactory } from '../../commands/command-factory';
import { GameDefinitionRepositoryDefault } from '../../impl/game-definition-repository-default';

import { HelpParser } from '../../parsers/help-parser';

describe('HelpParser', () => {
  describe('parse', () => {
    const gameDefinitionRepository = new GameDefinitionRepositoryDefault();
    const CommandFactoryMock = mockito.mock(CommandFactory);
    mockito.when(CommandFactoryMock.createHelpCommand())
      .thenReturn(new HelpCommand(gameDefinitionRepository));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new HelpParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'help\'.', () => {
      const command = parser.parse('help');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createHelpCommand()).once();
    });

    it('Should return a command when input is \'h\'.', () => {
      const command = parser.parse('h');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createHelpCommand()).once();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createHelpCommand()).never();
    });

    it('Should return null when input is empty.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createHelpCommand()).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createHelpCommand()).never();
    });
  });
});