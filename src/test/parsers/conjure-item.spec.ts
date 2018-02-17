'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { ConjureItemCommand } from '../../commands/conjure-item-command';
import { CommandFactory } from '../../commands/command-factory';
import { ItemRepositoryDefault } from '../../impl/item-repository-default';

import { ConjureItemParser } from '../../parsers/conjure-item-parser';

describe('ConjureItemParser', () => {
  describe('parseInput', () => {
    const ItemRepositoryMock = mockito.mock(ItemRepositoryDefault);
    const itemRepository = mockito.instance(ItemRepositoryMock);

    const CommandFactoryMock = mockito.mock(CommandFactory);
    const rawCommandFactory = mockito.instance(CommandFactoryMock);
    mockito.when(CommandFactoryMock.createConjureItemCommand(mockito.anything(), mockito.anything()))
      .thenReturn(new ConjureItemCommand(rawCommandFactory, itemRepository, 1, 1));
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new ConjureItemParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'conjureitem 1002\'.', () => {
      const command = parser.parse('conjureitem 1002');

      expect(command).not.to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(1002, 1)).once();
    });

    it('Should return a command when input is \'conjure 1002\'.', () => {
      const command = parser.parse('conjureitem 1002');

      expect(command).not.to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(1002, 1)).once();
    });

    it('Should return a command when input is \'ci 1002\'.', () => {
      const command = parser.parse('ci 1002');

      expect(command).not.to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(1002, 1)).once();
    });

    it('Should return a command when input is \'ci 1002 42\'.', () => {
      const command = parser.parse('ci 1002 42');

      expect(command).not.to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(1002, 42)).once();
    });

    it('Should return a command when input is \'ci 1002 42 extrawords\'.', () => {
      const command = parser.parse('ci 1002 42 extrawords');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(mockito.anything(), mockito.anything())).never();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(mockito.anything(), mockito.anything())).never();
    });

    it('Should return null when input is empty string.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(mockito.anything(), mockito.anything())).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createConjureItemCommand(mockito.anything(), mockito.anything())).never();
    });
  });
});