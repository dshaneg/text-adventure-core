'use strict';

import { ItemRepository, StartSetItem } from '../item-repository';

const itemDefinitions = require('../../game/items');
type StartItemDef = { id: number, count: number, equip: boolean };

/** Retrieves Items from storage */
export class ItemRepositoryDefault implements ItemRepository {
  constructor() {
    this.itemMap = createMap(itemDefinitions.items);
    this.startSet = buildStartSet(itemDefinitions.startSet, this.itemMap);
  }

  private itemMap: Map<number, any>;
  private startSet: StartSetItem[];

  public getStartSet(): StartSetItem[] {
    return this.startSet;
  }

  get(itemId: number): any {
    return this.itemMap.get(itemId);
  }
}

function createMap(definitions: any[]): Map<number, any> {
  const map = new Map();

  // is it cheating to just take the existing object and jam the text together in place?
  // maybe, but it sure is nicer to deal with.

  for (const item of definitions) {
    item.description = item.description.join('\n');
    map.set(item.id, item);
  }

  return map;
}

function buildStartSet(startSetDefinition: StartItemDef[], itemMap: Map<number, any>) {
  const list: StartSetItem[] = [];

  for (const startItemDefinition of startSetDefinition) {
    const item = itemMap.get(startItemDefinition.id);

    if (item) {
      list.push({ item, count: startItemDefinition.count, equip: startItemDefinition.equip });
    }
  }

  return list;
}

