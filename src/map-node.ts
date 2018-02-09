'use strict';

export type Edge = { direction: string, headNode: MapNode, tailNode: MapNode };
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
    this.edges.push(edge);
  }

  getSuccessor(direction: string) {
    const edge = this.edges.find(item => item.direction === direction);

    return edge && edge.headNode;
  }
}
