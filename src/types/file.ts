import { ConnectionObject } from '@connectlab-editor/components/connectionComponent';
import { EditorEnvironmentObject } from '@connectlab-editor/environment';
import { NodeObject } from '@connectlab-editor/interfaces/nodeInterface';
import Ajv, { JSONSchemaType } from 'ajv';
import { ConnectionVertices, SignalGraphObject, VectorObject } from './common';
import { SlotObject } from '@connectlab-editor/components/slotComponent';
import { TextObject } from '@connectlab-editor/components/textComponent';
const ajv = new Ajv();

const vectorSchema: JSONSchemaType<VectorObject> = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: ['x', 'y'],
};

const connectionVerticesSchema: JSONSchemaType<ConnectionVertices> = {
  type: 'object',
  properties: {
    start: {
      type: 'object',
      properties: {
        slotId: { type: 'integer' },
        nodeId: { type: 'integer' },
      },
      required: ['nodeId', 'slotId'],
      nullable: true,
    },
    end: {
      type: 'object',
      properties: {
        slotId: { type: 'integer' },
        nodeId: { type: 'integer' },
      },
      required: ['nodeId', 'slotId'],
      nullable: true,
    },
  },
};

const nodesSchema: JSONSchemaType<NodeObject> = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    componentType: { type: 'integer' },
    nodeType: { type: 'integer' },
    position: vectorSchema,
    slotIds: {
      type: 'array',
      items: { type: 'integer' },
    },
    state: { type: 'boolean' },
  },
  required: [
    'id',
    'componentType',
    'nodeType',
    'position',
    'slotIds',
    'state',
  ],
};

const connectionSchema: JSONSchemaType<ConnectionObject> = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    componentType: { type: 'integer' },
    position: vectorSchema,
    endPosition: vectorSchema,
    anchors: {
      type: 'array',
      items: vectorSchema,
    },
    connectedTo: connectionVerticesSchema,
  },
  required: [
    'id',
    'componentType',
    'position',
    'endPosition',
    'anchors',
    'connectedTo',
  ],
};

const slotSchema: JSONSchemaType<SlotObject> = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    componentType: { type: 'integer' },
    position: vectorSchema,
    parentId: { type: 'integer' },
    slotIdAtParent: { type: 'integer' },
    connectionIds: {
      type: 'array',
      items: { type: 'integer' },
    },
    inSlot: { type: 'boolean' },
    color: { type: 'string' },
    colorActive: { type: 'string' },
    radius: { type: 'number', minimum: 0 },
    attractionRadius: { type: 'number', minimum: 0 },
  },
  required: [
    'id',
    'componentType',
    'position',
    'parentId',
    'slotIdAtParent',
    'connectionIds',
    'inSlot',
    'color',
    'colorActive',
    'radius',
    'attractionRadius',
  ],
};

const textSchema: JSONSchemaType<TextObject> = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    componentType: { type: 'integer' },
    position: vectorSchema,
    text: { type: 'string' },
    parent: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        type: { type: 'integer' },
      },
      required: ['id', 'type'],
      nullable: true,
    },
    style: { type: 'string' },
  },
  required: [
    'id',
    'componentType',
    'position',
    'text',
    'style',
  ],
};

const signalSchema: JSONSchemaType<SignalGraphObject> = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    data: {
      type: 'object',
      properties: {
        output: { type: 'boolean' },
        signalFrom: {
          type: 'array',
          items: { type: 'array', items: { type: 'integer' } },
        },
        signalTo: {
          type: 'array',
          items: { type: 'integer' },
        },
        nodeType: { type: 'integer' },
      },
      required: [
        'output',
        'signalFrom',
        'signalTo',
        'nodeType',
      ],
    },
  },
  required: ['id', 'data'],
};

export const fileSchema: JSONSchemaType<EditorEnvironmentObject> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        nodes: {
          type: 'array',
          items: nodesSchema,
        },
        connections: {
          type: 'array',
          items: connectionSchema,
        },
        slots: {
          type: 'array',
          items: slotSchema,
        },
        texts: {
          type: 'array',
          items: textSchema,
        },
      },
      required: [
        'nodes',
        'connections',
        'slots',
        'texts',
      ],
    },
    signal: {
      type: 'array',
      items: signalSchema,
    },
  },
  required: ['id', 'data', 'signal'],
};

export const fileValidator = ajv.compile(fileSchema);
