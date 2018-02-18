'use strict';

import { expect } from 'chai';
import 'mocha';
import * as mockito from 'ts-mockito';

import { CommandFactory } from '../../commands/command-factory';
import { ItemRepositoryDefault } from '../../impl/item-repository-default';
import { GameDefinitionRepositoryDefault } from '../../impl/game-definition-repository-default';
import { MapNodeRepositoryDefault } from '../../impl/map-node-repository-default';
import { StartSetItem } from '../../item-repository';
import { GameMap } from '../../domain/game-map';
import { MapNode } from '../../domain/map-node';
import { GameState } from '../../state/game-state';
import { EventPublisher } from '../../domain/event-publisher';
import { EventQueue } from '../../event-queue';
import { Voice } from '../../domain/voice';

import { StartGameCommand } from '../../commands/start-game-command';
import { AddInventoryCommand } from '../../commands/add-inventory-command';
import { EquipItemCommand } from '../../commands/equip-item-command';
import { TeleportCommand } from '../../commands/teleport-command';

describe('StartGameCommand', () => {
  describe('execute', () => {
    // mock GameState
    const GameStateMock = mockito.mock(GameState);
    let gameState: GameState;

    // mock the EventPublisher
    const EventPublisherMock = mockito.mock(EventQueue);
    const publisher = mockito.instance(EventPublisherMock);

    // mock the Item Repository
    const ItemRepositoryMock = mockito.mock(ItemRepositoryDefault);
    const startSet = [
      { item: { id: 1, name: 'fork' }, count: 1, equip: true },
      { item: { id: 2, name: 'spoon' }, count: 1, equip: true },
      { item: { id: 3, name: 'butter knife' }, count: 1, equip: true }
    ];
    mockito.when(ItemRepositoryMock.getStartSet()).thenReturn(startSet);
    const itemRepository = mockito.instance(ItemRepositoryMock);

    // mock the Game Definition Repository
    const gameDefinition = {
      banner: 'banner text',
      opening: 'opening text',
      help: 'help text'
    };
    const GameDefinitionRepositoryMock = mockito.mock(GameDefinitionRepositoryDefault);
    mockito.when(GameDefinitionRepositoryMock.getGameDefinition()).thenReturn(gameDefinition);

    const gameDefinitionRepository = mockito.instance(GameDefinitionRepositoryMock);

    // mock the Map Node Repository
    const MapNodeRepositoryMock = mockito.mock(MapNodeRepositoryDefault);
    const entryNodeConfig = {
      id: 1,
      name: 'entry',
      description: ['entry node'],
      location: { x: 0, y: 0, z: 0 }
    };
    const entryNode: MapNode = new MapNode(entryNodeConfig);
    const nodeMap = new Map<number, MapNode>();
    nodeMap.set(entryNode.id, entryNode);
    const gameMap: GameMap = new GameMap(nodeMap, entryNode.id);

    mockito.when(MapNodeRepositoryMock.getMap()).thenReturn(gameMap);
    const mapNodeRepository = mockito.instance(MapNodeRepositoryMock);

    // mock the Command Factory
    const CommandFactoryMock = mockito.mock(CommandFactory);
    const AddInventoryCommandMock = mockito.mock(AddInventoryCommand);
    const EquipItemCommandMock = mockito.mock(EquipItemCommand);
    const TeleportCommandMock = mockito.mock(TeleportCommand);

    const addInventoryCommand = mockito.instance(AddInventoryCommandMock);
    mockito.when(CommandFactoryMock.createAddInventoryCommand(mockito.anything(), mockito.anything()))
      .thenReturn(addInventoryCommand);

    const equipItemCommand = mockito.instance(EquipItemCommandMock);
    mockito.when(CommandFactoryMock.createEquipItemCommand(mockito.anything(), mockito.anything()))
      .thenReturn(equipItemCommand);

    const teleportCommand = mockito.instance(TeleportCommandMock);
    mockito.when(CommandFactoryMock.createTeleportCommand(mockito.anything(), mockito.anything()))
      .thenReturn(teleportCommand);

    const commandFactory = mockito.instance(CommandFactoryMock);

    const repositorySet = {
      itemRepository,
      gameDefinitionRepository,
      mapNodeRepository
    };

    beforeEach(() => {
      mockito.reset(GameStateMock);

      mockito.resetCalls(EventPublisherMock);
      mockito.resetCalls(AddInventoryCommandMock);
      mockito.resetCalls(EquipItemCommandMock);
      mockito.resetCalls(TeleportCommandMock);
      mockito.resetCalls(CommandFactoryMock);
      mockito.resetCalls(ItemRepositoryMock);
    });

    describe('Happy Path', () => {
      let command: StartGameCommand;

      beforeEach(() => {
        command = new StartGameCommand(commandFactory, repositorySet);
        gameState = mockito.instance(GameStateMock);
        command.execute(gameState, publisher);
      });

      it('Should publish 2 events.', () => {
        mockito.verify(EventPublisherMock.publish(mockito.anything())).twice();
      });

      it('Should publish game.starting event first.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).first();

        const expectedEvent = {
          topic: 'game.starting',
          message: gameDefinition.banner,
          voice: Voice.herald
        };

        expect(event).to.deep.equal(expectedEvent);
      });

      it('Should publish game.started event second.', () => {
        const [event] = mockito.capture(EventPublisherMock.publish).second();

        const expectedEvent = {
          topic: 'game.started',
          message: gameDefinition.opening,
          voice: Voice.bard
        };

        expect(event).to.deep.equal(expectedEvent);
      });

      // AddInventoryCommand

      it('Should call commandfactory to create AddInventoryCommand.', () => {
        mockito.verify(CommandFactoryMock.createAddInventoryCommand(mockito.anything(), mockito.anything())).once();
      });

      it('Should pass starting item set to create AddInventoryCommand call.', () => {
        const [passedItemSet, silent] = mockito.capture(CommandFactoryMock.createAddInventoryCommand).first();

        expect(passedItemSet).to.deep.equal(startSet);
      });

      it('Should request silent mode on create AddInventoryCommand call.', () => {
        const [passedItemSet, silent] = mockito.capture(CommandFactoryMock.createAddInventoryCommand).first();

        expect(silent).to.be.true;
      });

      it('Should execute AddInventoryCommand.', () => {
        mockito.verify(AddInventoryCommandMock.execute(gameState, publisher)).once();
      });

      // EquipItemCommand

      it('Should call commandfactory to create EquipItemCommand twice.', () => {
        mockito.verify(CommandFactoryMock.createEquipItemCommand(mockito.anything(), mockito.anything())).twice();
      });

      it('Should pass spoon to first create EquipItemCommand call.', () => {
        const [passedItem, silent] = mockito.capture(CommandFactoryMock.createEquipItemCommand).first();

        expect(passedItem).to.deep.equal(startSet[1].item);
      });

      it('Should pass knife to second create EquipItemCommand call.', () => {
        const [passedItem, silent] = mockito.capture(CommandFactoryMock.createEquipItemCommand).second();

        expect(passedItem).to.deep.equal(startSet[2].item);
      });

      it('Should request silent mode on first create EquipItemCommand call.', () => {
        const [passedItemSet, silent] = mockito.capture(CommandFactoryMock.createEquipItemCommand).first();

        expect(silent).to.be.true;
      });

      it('Should request silent mode on second create EquipItemCommand call.', () => {
        const [passedItemSet, silent] = mockito.capture(CommandFactoryMock.createEquipItemCommand).second();

        expect(silent).to.be.true;
      });

      it('Should execute EquipItemCommand twice.', () => {
        mockito.verify(EquipItemCommandMock.execute(gameState, publisher)).twice();
      });

      // TeleportCommand

      it('Should call commandfactory to create TeleportCommand.', () => {
        mockito.verify(CommandFactoryMock.createTeleportCommand(mockito.anything(), mockito.anything())).once();
      });

      it('Should pass starting node id to create TeleportCommand call.', () => {
        const [entryNodeId, silent] = mockito.capture(CommandFactoryMock.createTeleportCommand).first();

        expect(entryNodeId).to.equal(entryNode.id);
      });

      it('Should request silent mode on create TeleportCommand call.', () => {
        const [entryNodeId, silent] = mockito.capture(CommandFactoryMock.createTeleportCommand).first();

        expect(silent).to.be.true;
      });

      it('Should execute TeleportCommand.', () => {
        mockito.verify(TeleportCommandMock.execute(gameState, publisher)).once();
      });

      // gameState start
      it('Should execute start on gameState.', () => {
        mockito.verify(GameStateMock.start()).once();
      });
    });

    describe('Starting an already started game', () => {
      let command: StartGameCommand;

      beforeEach(() => {
        command = new StartGameCommand(commandFactory, repositorySet);

        // the game is already started when we run these tests
        mockito.when(GameStateMock.isStarted).thenReturn(true);
        gameState = mockito.instance(GameStateMock);

        command.execute(gameState, publisher);
      });

      it('Should not publish events.', () => {
        mockito.verify(EventPublisherMock.publish(mockito.anything())).never();
      });

      it('Should not call commandfactory to create AddInventoryCommand.', () => {
        mockito.verify(CommandFactoryMock.createAddInventoryCommand(mockito.anything(), mockito.anything())).never();
      });

      it('Should not call commandfactory to create EquipItemCommand.', () => {
        mockito.verify(CommandFactoryMock.createEquipItemCommand(mockito.anything(), mockito.anything())).never();
      });

      it('Should not call commandfactory to create TeleportCommand.', () => {
        mockito.verify(CommandFactoryMock.createTeleportCommand(mockito.anything(), mockito.anything())).never();
      });

      it('Should not execute start on gameState.', () => {
        mockito.verify(GameStateMock.start()).never();
      });
    });
  });
});