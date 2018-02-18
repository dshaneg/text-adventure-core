'use strict';

import { expect } from 'chai';
import 'mocha';

import { MapNode, } from '../../domain/map-node';
import { GameMap } from '../../domain/game-map';

const configs = [{
  id: 0,
  name: 'test node 1',
  description: ['line 1', 'line 2'],
  location: { x: 0, y: 0, z: 0 }
}, {
  id: 1,
  name: 'test node 2',
  description: ['line 3', 'line 4'],
  location: { x: 1, y: 0, z: 0 }
}];

describe('GameMap', () => {
  describe('get entryNode', () => {
    it('Should return the starting node of the map.', () => {
      const a = new MapNode(configs[0]);
      const b = new MapNode(configs[1]);
      const nodeMap = new Map<number, MapNode>();
      nodeMap.set(a.id, a);
      nodeMap.set(b.id, b);

      const gm = new GameMap(nodeMap, a.id);

      expect(gm.entryNode).to.deep.equal(a);
    });
  });

  describe('get', () => {
    it('Happy path. Should return the requested node if it is there.', () => {
      const a = new MapNode(configs[0]);
      const nodeMap = new Map<number, MapNode>();
      nodeMap.set(a.id, a);

      const gm = new GameMap(nodeMap, a.id);

      expect(gm.get(a.id)).to.deep.equal(a);
    });

    it('Should return undefined if no node found for the given id.', () => {
      const a = new MapNode(configs[0]);
      const nodeMap = new Map<number, MapNode>();
      nodeMap.set(a.id, a);

      const gm = new GameMap(nodeMap, a.id);

      expect(gm.get(99)).to.be.undefined;
    });
  });
});