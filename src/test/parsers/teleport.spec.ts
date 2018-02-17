'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { TeleportCommand } from '../../commands/teleport-command';
import { CommandFactory } from '../../commands/command-factory';
import { GameMap } from '../../domain/game-map';

import { TeleportParser } from '../../parsers/teleport-parser';

describe('TeleportParser', () => {
  describe('parse', () => {
    const gameMap = mockito.instance(mockito.mock(GameMap));
    const CommandFactoryMock = mockito.mock(CommandFactory);
    mockito.when(CommandFactoryMock.createTeleportCommand(mockito.anything()))
      .thenReturn(new TeleportCommand(gameMap, 1));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new TeleportParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'teleport 10\'.', () => {
      const command = parser.parse('teleport 10');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createTeleportCommand(10)).once();
    });

    it('Should return a command when input is \'port 10\'.', () => {
      const command = parser.parse('port 10');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createTeleportCommand(10)).once();
    });

    it('Should return a command when input is \'portal 10\'.', () => {
      const command = parser.parse('portal 10');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createTeleportCommand(10)).once();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createTeleportCommand(mockito.anything())).never();
    });

    it('Should return null when input is empty.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createTeleportCommand(mockito.anything())).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createTeleportCommand(mockito.anything())).never();
    });
  });
});