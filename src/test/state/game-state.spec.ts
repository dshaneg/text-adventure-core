'use strict';

import { expect } from 'chai';
import 'mocha';

import { GameState } from '../../state/game-state';
import { MapNode } from '../../domain/map-node';
import { GameMap } from '../../domain/game-map';

describe('GameState', () => {
  let state: GameState;

  beforeEach(() => {
    state = new GameState('testsession');
  });

  describe('constructor', () => {
    it('Game should not be started after gamestate creation.', () => {
      expect(state.isStarted).to.be.false;
    });

    it('The current node should be the \'real world\'. ', () => {
      expect(state.queryCurrentNode().name).to.equal('the real world');
    });

    it('Inventory should be empty. ', () => {
      expect(state.queryInventory).to.have.lengthOf(0);
    });

    it('Session token should be set. ', () => {
      expect(state.sessionToken).to.equal('testsession');
    });
  });

  describe('start', () => {
    it('Should set the game state to started.', () => {
      state.start();

      expect(state.isStarted).to.equal(true);
    });
  });

  describe('stop', () => {
    it('Should set the game state to not started.', () => {
      state.start();
      state.stop();

      expect(state.isStarted).to.equal(false);
    });
  });

  describe('tryMove', () => {
    let destNode: MapNode;

    beforeEach(() => {
      // set up a single path from the starting node to a new node to the south
      const destConfig = {
        id: 1,
        name: 'dest',
        description: ['dest node'],
        location: { x: 0, y: -1, z: 0 },
      };
      destNode = new MapNode(destConfig);
      state.queryCurrentNode().addEdge({ direction: 's', headNode: destNode });
    });

    it('returns false when requested move is not available.', () => {
      expect(state.tryMove('n')).to.be.false;
    });

    it('returns false when requested direction doesn\'t represent a recognized direction.', () => {
      expect(state.tryMove('x')).to.be.false;
    });

    it('should remain on same node if tryMove fails.', () => {
      const current = state.queryCurrentNode();

      state.tryMove('n');

      expect(state.queryCurrentNode().id).to.equal(current.id);
    });

    it('returns true when a move is successful.', () => {
      expect(state.tryMove('s')).to.be.true;
    });

    it('should have current node set to dest node on success.', () => {
      state.tryMove('s');
      expect(state.queryCurrentNode().id).to.equal(destNode.id);
    });
  });

  describe('teleport', () => {
    it('should move to destination node.', () => {
      // creating a map node that does not have an edge get to it
      const destConfig = {
        id: 1,
        name: 'dest',
        description: ['dest node'],
        location: { x: 0, y: -1, z: 0 },
      };
      const destNode = new MapNode(destConfig);

      state.teleport(destNode);

      expect(state.queryCurrentNode().id).to.equal(destConfig.id);
    });

    it('should throw error if node is null.', () => {
      expect(() => state.teleport(undefined)).to.throw(/^Can\'t teleport/);
    });
  });

  describe('addInventory', () => {
    const spoon = { id: 1000, name: 'spoon' };
    const fork = { id: 1001, name: 'fork' };

    it('should add requested item item to inventory', () => {
      state.addInventory(spoon);

      expect(state.queryInventory()[0].item).to.deep.equal(spoon);
    });

    it('should add single instance of item to inventory', () => {
      state.addInventory(spoon);

      expect(state.queryInventory()).has.lengthOf(1);
    });

    it('added item should have count = 1 when count not specified', () => {
      state.addInventory(spoon);

      expect(state.queryInventory()[0].count).to.equal(1);
    });

    it('should add single instance of item to inventory when adding count > 1', () => {
      state.addInventory(spoon, 5);

      expect(state.queryInventory()).has.lengthOf(1);
    });

    it('added item should have specified count when count is specified', () => {
      state.addInventory(spoon, 5);

      expect(state.queryInventory()[0].count).to.equal(5);
    });

    it('should handle more than one item in inventory', () => {
      state.addInventory(spoon, 5);
      state.addInventory(fork, 5);

      expect(state.queryInventory()).to.have.lengthOf(2);
    });
  });

  describe('equip', () => {
    const spoon = { id: 1000, name: 'spoon' };
    const fork = { id: 1001, name: 'fork' };

    it('should add item to equipped items', () => {
      state.equip(spoon);

      expect(state.queryEquippedItems()).to.contain(spoon);
    });

    it('should be able to equip multiple items', () => {
      state.equip(spoon);
      state.equip(fork);

      expect(state.queryEquippedItems()).to.have.lengthOf(2);
    });
  });

  // this functionality will be tested more thoroughly in tests for player-map-node
  describe('queryAvailableDirections', () => {
    // set up a single path from the starting node to a new node to the south
    // set up the gamemap
    const entryNodeConfig = {
      id: 1,
      name: 'entry',
      description: ['entry node'],
      location: { x: 0, y: 0, z: 0 }
    };
    const targetNodeConfig = {
      id: 2,
      name: 'target',
      description: ['target node'],
      location: { x: 1, y: 1, z: 1 }
    };

    let gameMap: GameMap;
    let entryNode: MapNode;
    let targetNode: MapNode;

    beforeEach(() => {
      entryNode = new MapNode(entryNodeConfig);
      targetNode = new MapNode(targetNodeConfig);

      const nodeMap = new Map<number, MapNode>();
      nodeMap.set(entryNode.id, entryNode);
      nodeMap.set(targetNode.id, targetNode);

      gameMap = new GameMap(nodeMap, entryNode.id);

      //  [startnode] have to teleport in to the map
      //
      //  [entrynode]
      //    v    ^
      //  [targetnode]

      entryNode.addEdge({ direction: 's', headNode: targetNode });
      targetNode.addEdge({ direction: 'n', headNode: entryNode });
    });

    it('should list a single direction when only one is available', () => {
      state.teleport(entryNode);

      expect(state.queryAvailableDirections(gameMap)).to.have.lengthOf(1);
    });
  });
});