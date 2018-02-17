'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { ListInventoryCommand } from '../../commands/list-inventory-command';
import { CommandFactory } from '../../commands/command-factory';

import { ListInventoryParser } from '../../parsers/list-inventory-parser';

describe('ListInventoryParser', () => {
  describe('parse', () => {
    const CommandFactoryMock = mockito.mock(CommandFactory);
    mockito.when(CommandFactoryMock.createListInventoryCommand())
      .thenReturn(new ListInventoryCommand());
    const commandFactory = mockito.instance(CommandFactoryMock);

    const parser = new ListInventoryParser(commandFactory);

    beforeEach(() => {
      mockito.resetCalls(CommandFactoryMock);
    });

    it('Should return a command when input is \'inventory\'.', () => {
      const command = parser.parse('inventory');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createListInventoryCommand()).once();
    });

    it('Should return a command when input is \'inv\'.', () => {
      const command = parser.parse('inv');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createListInventoryCommand()).once();
    });

    it('Should return a command when input is \'i\'.', () => {
      const command = parser.parse('i');

      expect(command).to.not.be.null;
      mockito.verify(CommandFactoryMock.createListInventoryCommand()).once();
    });

    it('Should return null when input is \'dummy\'.', () => {
      const command = parser.parse('dummy');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createListInventoryCommand()).never();
    });

    it('Should return null when input is empty.', () => {
      const command = parser.parse('');

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createListInventoryCommand()).never();
    });

    it('Should return null when input is null.', () => {
      const command = parser.parse(null);

      expect(command).to.be.null;
      mockito.verify(CommandFactoryMock.createListInventoryCommand()).never();
    });
  });
});