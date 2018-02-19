'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { ItemFormatter } from '../../commands/item-formatter';

const butterKnife = { id: 1, name: 'butter knife' };
const epicButterKnife = { id: 1, name: 'butter knife', suffix: 'of melting' };
const ocarina = { id: 1, name: 'ocarina', suffix: 'of vivid dreaming' };
const fork = { id: 1, name: 'fork', suffix: 'of the ravenous' };
const epicFork = { id: 1, name: 'Forkalibur', isProperNoun: true };

describe('ItemFormatter', () => {
  describe('formatListItem', () => {
    it('formats a single item with no number', () => {
      expect(ItemFormatter.formatListItem(butterKnife, 1)).to.equal('butter knife');
    });

    it('formats a single item with a suffix', () => {
      expect(ItemFormatter.formatListItem(fork, 1)).to.equal('fork of the ravenous');
    });

    it('formats a stack of items', () => {
      expect(ItemFormatter.formatListItem(butterKnife, 5)).to.equal('butter knife (5)');
    });

    it('formats a stack of items with a suffix', () => {
      expect(ItemFormatter.formatListItem(epicButterKnife, 5)).to.equal('butter knife of melting (5)');
    });
  });

  describe('formatProseItem', () => {
    it('formats a single item with no number', () => {
      expect(ItemFormatter.formatProseItem(butterKnife, 1)).to.equal('a butter knife');
    });

    it('formats a single item with no number that starts with a vowel', () => {
      expect(ItemFormatter.formatProseItem(ocarina, 1)).to.equal('an ocarina of vivid dreaming');
    });

    it('formats a stack of items', () => {
      expect(ItemFormatter.formatProseItem(butterKnife, 5)).to.equal('five butter knives');
    });

    it('formats a tall stack of items', () => {
      expect(ItemFormatter.formatProseItem(epicButterKnife, 50000)).to.equal('fifty thousand butter knives of melting');
    });

    it('formats an item with a proper name', () => {
      expect(ItemFormatter.formatProseItem(epicFork, 1)).to.equal('Forkalibur');
    });

    it('formats a stack with a proper name', () => {
      expect(ItemFormatter.formatProseItem(epicFork, 10)).to.equal('ten Forkaliburs');
    });

  });
});