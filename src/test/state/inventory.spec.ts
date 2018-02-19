'use strict';

import { expect } from 'chai';
import 'mocha';

import { Inventory } from '../../state/inventory';

const spoon = { id: 1000, name: 'spoon' };
const fork = { id: 1001, name: 'fork' };

describe('Inventory', () => {
  let inventory: Inventory;

  beforeEach(() => {
    inventory = new Inventory();
  });

  describe('constructor', () => {
    it('Inventory should be empty upon creation.', () => {
      expect(inventory.getAll()).to.have.lengthOf(0);
    });

    it('Should have no equipped items upon creation.', () => {
      expect(inventory.getEquipped()).to.have.lengthOf(0);
    });
  });

  describe('add', () => {
    it('should add requested item item to inventory', () => {
      inventory.add(spoon, 1);

      expect(inventory.getAll()[0].item).to.deep.equal(spoon);
    });

    it('should add single instance of item to inventory', () => {
      inventory.add(spoon, 1);

      expect(inventory.getAll()).to.have.lengthOf(1);
    });

    it('should add single instance of item to inventory when adding count > 1', () => {
      inventory.add(spoon, 5);

      expect(inventory.getAll()).has.lengthOf(1);
    });

    it('added item should have specified count', () => {
      inventory.add(spoon, 5);

      expect(inventory.getStack(spoon.id).count).to.equal(5);
    });

    it('should handle more than one item in inventory', () => {
      inventory.add(spoon, 5);
      inventory.add(fork, 5);

      expect(inventory.getAll()).to.have.lengthOf(2);
    });

    it('should not create a new stack if adding an item already in inventory', () => {
      inventory.add(spoon, 5);
      inventory.add(spoon, 5);

      expect(inventory.getAll()).to.have.lengthOf(1);
    });

    it('should sum items in an existing stack if adding an item already in inventory', () => {
      inventory.add(spoon, 5);
      inventory.add(spoon, 5);

      expect(inventory.getAll()[0].count).to.equal(10);
    });
  });

  describe('equip', () => {
    const spoon = { id: 1000, name: 'spoon' };
    const fork = { id: 1001, name: 'fork' };

    it('should add item to equipped items', () => {
      inventory.equip(spoon);

      expect(inventory.getEquipped()).to.contain(spoon);
    });

    it('should be able to equip multiple items', () => {
      inventory.equip(spoon);
      inventory.equip(fork);

      expect(inventory.getEquipped()).to.have.lengthOf(2);
    });
  });

  describe('getStack', () => {
    it('returns the item stack when found.', () => {
      inventory.add(spoon, 5);

      const stack = inventory.getStack(spoon.id);

      expect(stack.item).to.deep.equal(spoon);
      expect(stack.count).to.equal(5);
    });
  });

  describe('getEquipped', () => {
    it('should return empty list if no items are equipped', () => {
      expect(inventory.getEquipped()).to.have.lengthOf(0);
    });

    it('should return equipped items if they exist', () => {
      inventory.equip(spoon);

      expect(inventory.getEquipped()).to.contain(spoon);
    });

    it('should be able to equip multiple items', () => {
      inventory.equip(spoon);
      inventory.equip(fork);

      expect(inventory.getEquipped()).to.have.lengthOf(2);
    });
  });

  describe('getAll', () => {
    it('should return empty list if no items in inventory', () => {
      expect(inventory.getAll()).to.have.lengthOf(0);
    });

    it('should return all items in inventory', () => {
      inventory.add(spoon, 5);
      inventory.add(fork, 5);

      expect(inventory.getAll()).to.have.lengthOf(2);
    });
  });
});