'use strict';

import { expect } from 'chai';
import 'mocha';

import { DirectionIndex } from '../../domain/direction-index';

describe('DirectionIndex', () => {
  describe('getDirectionName', () => {
    it('Should return \'north\' when given \'n\'.', () => {
      expect(DirectionIndex.getDirectionName('n')).to.equal('north');
    });

    it('Should return \'south\' when given \'s\'.', () => {
      expect(DirectionIndex.getDirectionName('s')).to.equal('south');
    });

    it('Should return \'east\' when given \'e\'.', () => {
      expect(DirectionIndex.getDirectionName('e')).to.equal('east');
    });

    it('Should return \'west\' when given \'w\'.', () => {
      expect(DirectionIndex.getDirectionName('w')).to.equal('west');
    });

    it('Should return \'up\' when given \'u\'.', () => {
      expect(DirectionIndex.getDirectionName('u')).to.equal('up');
    });

    it('Should return \'down\' when given \'d\'.', () => {
      expect(DirectionIndex.getDirectionName('d')).to.equal('down');
    });

    it('Should return \'unknown\' when given \'x\'.', () => {
      expect(DirectionIndex.getDirectionName('x')).to.equal('unknown');
    });

    it('Should return \'unknown\' when given nothing.', () => {
      expect(DirectionIndex.getDirectionName(undefined)).to.equal('unknown');
    });

    it('Should handle whole words.', () => {
      expect(DirectionIndex.getDirectionName('north')).to.equal('north');
    });

    it('Should handle upper case input.', () => {
      expect(DirectionIndex.getDirectionName('N')).to.equal('north');
    });
  });
});