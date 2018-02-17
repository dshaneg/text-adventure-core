'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { StartGameCommand } from '../../commands/start-game-command';
import { CommandFactory } from '../../commands/command-factory';
import { ItemRepositoryDefault } from '../../impl/item-repository-default';
import { GameDefinitionRepositoryDefault } from '../../impl/game-definition-repository-default';
import { MapNodeRepositoryDefault } from '../../impl/map-node-repository-default';

import { StartGameParser } from '../../parsers/start-game-parser';

describe('StartGameParser', () => {
  describe('parse', () => {
    const CommandFactoryMock = mockito.mock(CommandFactory);
    const rawCommandFactory = mockito.instance(CommandFactoryMock);

    const itemRepository = mockito.instance(mockito.mock(ItemRepositoryDefault));
    const gameDefinitionRepository = mockito.instance(mockito.mock(GameDefinitionRepositoryDefault));
    const mapNodeRepository = mockito.instance(mockito.mock(MapNodeRepositoryDefault));

    mockito.when(CommandFactoryMock.createStartGameCommand())
      .thenReturn(new StartGameCommand(rawCommandFactory,
        { itemRepository, gameDefinitionRepository, mapNodeRepository }));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new StartGameParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'start game\'.', () => {
      const command = parser.parse('start game');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createStartGameCommand()).once();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createStartGameCommand()).never();
    });

    it('Should return null when input is empty.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createStartGameCommand()).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createStartGameCommand()).never();
    });
  });
});