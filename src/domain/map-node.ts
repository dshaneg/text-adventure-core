'use strict';

export type Edge = { direction: string, headNode: MapNode };
export type MapCoordinates = { x: number, y: number, z: number };

export class MapNode {
  constructor(nodeConfig: any) {
    this.id = nodeConfig.id;
    this.name = nodeConfig.name;
    this.description = nodeConfig.description.join('\n');
    this.location = nodeConfig.location;
    this.edges = [];
  }

  public id: number;
  public name: string;
  public description: string;
  public location: MapCoordinates;
  public edges: Array<Edge>;

  addEdge(edge: Edge) {
    if (this.edges.find(item => item.direction === edge.direction)) {
      throw new Error(`Can not add node ${edge.headNode.id} as an edge. There is already an edge with direction \`${edge.direction}\` on node ${this.id}.`);
    }
    this.edges.push(edge);
  }

  getSuccessor(direction: string) {
    const edge = this.edges.find(item => item.direction === direction);

    return edge && edge.headNode;
  }
}
