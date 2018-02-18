'use strict';

const itemDefinitions = require('../game/items');

export type StartSetItem = { item: object, count: number, equip: boolean };

/** Retrieves Items from storage */
export interface ItemRepository {
  getStartSet(): StartSetItem[];

  get(itemId: number): object;
}
