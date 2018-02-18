'use strict';

import { expect } from 'chai';
import 'mocha';

import { MapNode, Edge, MapCoordinates } from '../../domain/map-node';

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
}, {
  id: 2,
  name: 'test node 3',
  description: ['line 5', 'line 6'],
  location: { x: 0, y: 1, z: 0 }
}];

describe.only('MapNode', () => {
  describe('addEdge', () => {
    it('Should add an edge to edges array when calling addEdge.', () => {
      const a = new MapNode(configs[0]);
      const b = new MapNode(configs[1]);

      a.addEdge({ headNode: b, direction: 'e' });

      expect(a.edges).to.have.lengthOf(1);
    });

    it('Should fail when adding a second edge in the same direction.', () => {
      const a = new MapNode(configs[0]);
      const b = new MapNode(configs[1]);
      const c = new MapNode(configs[2]);

      a.addEdge({ headNode: b, direction: 'e' });
    expect(() => a.addEdge({ headNode: c, direction: 'e' })).to.throw(/^Can not add node/);
    });
  });

  describe('getSuccessor', () => {
    it('Happy path. Should find a node in the given direction if it is there.', () => {
      const a = new MapNode(configs[0]);
      const b = new MapNode(configs[1]);

      a.addEdge({ headNode: b, direction: 'e' });

      expect(a.getSuccessor('e').id).to.equal(b.id);
    });

    it('Should return undefined if no node found in the given direction.', () => {
      const a = new MapNode(configs[0]);

      expect(a.getSuccessor('e')).is.undefined;
    });
  });
});