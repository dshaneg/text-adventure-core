'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { HelpCommand } from '../../commands/help-command';
import { CommandFactory } from '../../commands/command-factory';
import { GameDefinitionRepositoryDefault } from '../../impl/game-definition-repository-default';

import { HelpParser } from '../../parsers/help-parser';

describe('HelpParser', () => {
  describe('parseInput', () => {
    const gameDefinitionRepository = new GameDefinitionRepositoryDefault();
    const CommandFactoryMock = mockito.mock(CommandFactory);
    mockito.when(CommandFactoryMock.createHelpCommand())
      .thenReturn(new HelpCommand(gameDefinitionRepository));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const moveParser = new HelpParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'help\'.', () => {
      const command = moveParser.parse('help');

      expect(command).to.not.be.null;
    });

    it('Should return a command when input is \'h\'.', () => {
      const command = moveParser.parse('h');

      expect(command).to.not.be.null;
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = moveParser.parse('dummy');

      expect(command).to.be.null;
    });
  });
});