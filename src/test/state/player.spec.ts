'use strict';

import { expect } from 'chai';
import 'mocha';

import { GameState } from '../../state/game-state';
import { MapNode } from '../../domain/map-node';
import { GameMap } from '../../domain/game-map';
import { Player, createRealityNode } from '../../state/player';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player(createRealityNode());
  });

  describe('constructor', () => {
    it('sets current node to given node.', () => {
      expect(player.currentNode).to.deep.equal(createRealityNode());
    });

    it('Inventory should be empty. ', () => {
      expect(player.inventory.getAll()).to.have.lengthOf(0);
    });
  });

  describe('set currentNode', () => {
    const destConfig = {
      id: 1,
      name: 'dest',
      description: ['dest node'],
      location: { x: 0, y: -1, z: 0 },
    };
    const destNode = new MapNode(destConfig);

    it('Should make given node current.', () => {
      player.currentNode = destNode;

      expect(player.currentNode).to.deep.equal(destNode);
    });

    it('Should increment visit count of destination node.', () => {
      player.currentNode = destNode;

      expect(player.visited(destNode)).to.equal(1);
    });

    it('Should increment visit count of destination node if visited again.', () => {
      player.currentNode = destNode;
      player.currentNode = destNode;

      expect(player.visited(destNode)).to.equal(2);
    });
  });
});