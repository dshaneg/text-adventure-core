'use strict';

import { expect } from 'chai';
import 'mocha';

import { GameState } from '../../state/game-state';
import { MapNode } from '../../domain/map-node';
import { GameMap } from '../../domain/game-map';

import { PlayerMapNode } from '../../state/player-map-node';

describe('PlayerMapNode', () => {
  let pmn: PlayerMapNode;
  let state: GameState;

  beforeEach(() => {
    pmn = new PlayerMapNode(1);
    state = new GameState('testsession');
  });

  describe('queryAvailableDirections', () => {
    // set up a single path from the starting node to a new node to the south
    // set up the gamemap
    const entryNodeConfig = {
      id: 1,
      name: 'entry',
      description: ['entry node'],
      location: { x: 0, y: 0, z: 0 }
    };
    const loopANodeConfig = {
      id: 2,
      name: 'loopA',
      description: ['loop node a'],
      location: { x: 1, y: 1, z: 1 }
    };
    const loopBNodeConfig = {
      id: 3,
      name: 'loopB',
      description: ['loop node b'],
      location: { x: 1, y: 1, z: 1 }
    };
    const loopCNodeConfig = {
      id: 4,
      name: 'loopC',
      description: ['loop node c'],
      location: { x: 1, y: 1, z: 1 }
    };

    let gameMap: GameMap;
    let entryNode: MapNode;
    let loopANode: MapNode;
    let loopBNode: MapNode;
    let loopCNode: MapNode;

    beforeEach(() => {
      entryNode = new MapNode(entryNodeConfig);
      loopANode = new MapNode(loopANodeConfig);
      loopBNode = new MapNode(loopBNodeConfig);
      loopCNode = new MapNode(loopCNodeConfig);

      const nodeMap = new Map<number, MapNode>();
      nodeMap.set(entryNode.id, entryNode);
      nodeMap.set(loopANode.id, loopANode);
      nodeMap.set(loopBNode.id, loopBNode);
      nodeMap.set(loopCNode.id, loopCNode);

      gameMap = new GameMap(nodeMap, entryNode.id);

      //  [startnode] have to teleport in to the map
      //
      //  [entrynode]
      //    v    ^
      //  [           loopAnode           ]
      //    v    ^                v    ^
      //  [loopBnode]    < >    [loopCnode]

      entryNode.addEdge({ direction: 's', headNode: loopANode });
      loopANode.addEdge({ direction: 'n', headNode: entryNode });

      loopANode.addEdge({ direction: 's', headNode: loopBNode });
      loopBNode.addEdge({ direction: 'n', headNode: loopANode });

      loopBNode.addEdge({ direction: 'e', headNode: loopCNode });
      loopCNode.addEdge({ direction: 'w', headNode: loopBNode });

      loopCNode.addEdge({ direction: 'n', headNode: loopANode });
      loopANode.addEdge({ direction: 'e', headNode: loopCNode });
    });

    it('should list a single direction when only one is available', () => {
      // have to teleport in from the real world since there are no edges
      state.setCurrentLocation(entryNode);
      // state.tryMove('s');

      const expected: any[] = [{ direction: 's', traversed: false, 'visited': 0 }];
      expect(state.queryAvailableDirections(gameMap)).to.deep.equal(expected);
    });

    describe('Enter a simple loop', () => {
      beforeEach(() => {
        // have to teleport in from the real world since there are no edges
        state.setCurrentLocation(entryNode);
        state.setCurrentLocation(state.querySuccessorNode('s')); // now on loop a node
      });

      it('should list 3 available directions when entering a loop from outside the loop', () => {
        expect(state.queryAvailableDirections(gameMap)).to.have.lengthOf(3);
      });

      it('should include north, visited once, traversed', () => {
        const expected: any = { direction: 'n', traversed: true, 'visited': 1 };
        expect(state.queryAvailableDirections(gameMap)).to.deep.include(expected);
      });

      it('should include south, not visited, not traversed', () => {
        const expected: any = { direction: 's', traversed: false, 'visited': 0 };
        expect(state.queryAvailableDirections(gameMap)).to.deep.include(expected);
      });

      it('should include east, not visited, not traversed', () => {
        const expected: any = { direction: 'e', traversed: false, 'visited': 0 };
        expect(state.queryAvailableDirections(gameMap)).to.deep.include(expected);
      });
    });

    describe('Enter a simple loop and go back to start node', () => {
      beforeEach(() => {
        // have to teleport in from the real world since there are no edges
        state.setCurrentLocation(entryNode);
        state.setCurrentLocation(state.querySuccessorNode('s')); // now on loop a node
        state.setCurrentLocation(state.querySuccessorNode('n')); // now on entry node
      });

      it('should list 1 available direction', () => {
        expect(state.queryAvailableDirections(gameMap)).to.have.lengthOf(1);
      });

      it('should include south, visited once, not traversed', () => {
        const expected: any = { direction: 's', traversed: false, 'visited': 1 };
        expect(state.queryAvailableDirections(gameMap)).to.deep.include(expected);
      });

      it('current node should have been visited twice', () => {
        const expected: any = { direction: 'w', traversed: true, 'visited': 1 };
        expect(state.player.getPlayerMapNode(state.player.currentNode).visited).to.equal(2);
      });
    });

    describe('Traverse a simple loop without coming back to the start of the loop', () => {
      beforeEach(() => {
        // have to teleport in from the real world since there are no edges
        state.setCurrentLocation(entryNode);
        state.setCurrentLocation(state.querySuccessorNode('s')); // now on loop a node
        state.setCurrentLocation(state.querySuccessorNode('s')); // now on loop b node
        state.setCurrentLocation(state.querySuccessorNode('e')); // now on loop c node. has path back to a.
      });

      it('should list 2 available directions when entering a loop from outside the loop', () => {
        expect(state.queryAvailableDirections(gameMap)).to.have.lengthOf(2);
      });

      it('should include north, visited once, traversed', () => {
        const expected: any = { direction: 'n', traversed: true, 'visited': 1 };
        expect(state.queryAvailableDirections(gameMap)).to.deep.include(expected);
      });

      it('should include west, visited once, traversed', () => {
        const expected: any = { direction: 'w', traversed: true, 'visited': 1 };
        expect(state.queryAvailableDirections(gameMap)).to.deep.include(expected);
      });
    });
  });
});