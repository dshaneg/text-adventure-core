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

  describe('querySuccessorNode', () => {
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

    it('returns undefined when requested move is not available.', () => {
      expect(state.querySuccessorNode('n')).to.be.undefined;
    });

    it('returns undefined when requested direction doesn\'t represent a recognized direction.', () => {
      expect(state.querySuccessorNode('x')).to.be.undefined;
    });

    it('returns successor node if found.', () => {
      expect(state.querySuccessorNode('s')).to.deep.equal(destNode);
    });
  });

  describe('setCurrentLocation', () => {
    it('should move to destination node.', () => {
      // creating a map node that does not have an edge get to it
      const destConfig = {
        id: 1,
        name: 'dest',
        description: ['dest node'],
        location: { x: 0, y: -1, z: 0 },
      };
      const destNode = new MapNode(destConfig);

      state.setCurrentLocation(destNode);

      expect(state.queryCurrentNode().id).to.equal(destConfig.id);
    });

    it('should throw error if node is null.', () => {
      expect(() => state.setCurrentLocation(undefined)).to.throw(/^Can\'t set location/);
    });
  });

  describe('addInventory', () => {
    const spoon = { id: 1000, name: 'spoon' };

    // full inventory tests are done on the inventory object
    it('should add requested item item to inventory', () => {
      state.addInventory(spoon);

      expect(state.queryInventory()[0].item).to.deep.equal(spoon);
    });
  });

  describe('equip', () => {
    const spoon = { id: 1000, name: 'spoon' };
    const fork = { id: 1001, name: 'fork' };
    // full inventory tests are done on the inventory object

    it('should add item to equipped items', () => {
      state.equip(spoon);

      expect(state.queryEquippedItems()).to.contain(spoon);
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
      //  [entrynode]
      //    v    ^
      //  [targetnode]

      entryNode.addEdge({ direction: 's', headNode: targetNode });
      targetNode.addEdge({ direction: 'n', headNode: entryNode });
    });

    it('should list a single direction when only one is available', () => {
      // have to teleport in from the real world since there are no edges
      state.setCurrentLocation(entryNode);
      state.setCurrentLocation(state.querySuccessorNode('s'));

      expect(state.queryAvailableDirections(gameMap)).to.have.lengthOf(1);
    });
  });
});