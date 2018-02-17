'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { StopGameCommand } from '../../commands/stop-game-command';
import { CommandFactory } from '../../commands/command-factory';

import { StopGameParser } from '../../parsers/stop-game-parser';

describe('StartGameParser', () => {
  describe('parse', () => {
    const CommandFactoryMock = mockito.mock(CommandFactory);

    mockito.when(CommandFactoryMock.createStopGameCommand(mockito.anything()))
      .thenReturn(new StopGameCommand(false));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new StopGameParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a stop command with force when input is \'force stop game\'.', () => {
      const command = parser.parse('force stop game');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(true)).once();
    });

    it('Should return a stop command when input is \'quit\'.', () => {
      const command = parser.parse('quit');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(false)).once();
    });

    it('Should return a stop command when input is \'q\'.', () => {
      const command = parser.parse('q');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(false)).once();
    });

    it('Should return a stop command when input is \'exit\'.', () => {
      const command = parser.parse('exit');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(false)).once();
    });

    it('Should return a stop command when input is \'bye\'.', () => {
      const command = parser.parse('bye');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(false)).once();
    });

    it('Should return a stop command when input is \'leave\'.', () => {
      const command = parser.parse('leave');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(false)).once();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(mockito.anything())).never();
    });

    it('Should return null when input is empty.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(mockito.anything())).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createStopGameCommand(mockito.anything())).never();
    });
  });
});