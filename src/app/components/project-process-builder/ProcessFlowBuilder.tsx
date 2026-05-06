import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ProcessNode } from './ProcessNode';
import { DecisionNode } from './DecisionNode';
import { TriggerNode } from './TriggerNode';
import { NodeSidebar } from './NodeSidebar';
import { NodeCustomizer } from './NodeCustomizer';

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  trigger: TriggerNode,
};

export function ProcessFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const nodeType = event.dataTransfer.getData('nodeType');
      const label = event.dataTransfer.getData('label');

      if (!type) return;

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 40,
      };

      const newNode = {
        id: `node-${nodeIdCounter}`,
        type,
        position,
        data: {
          label,
          nodeType,
          config: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeIdCounter((id) => id + 1);
    },
    [nodeIdCounter, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, []);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="w-full h-[calc(100vh-5rem)] flex">
      <NodeSidebar />

      <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && selectedNodeData && (
        <NodeCustomizer
          node={selectedNodeData}
          onUpdate={(data) => updateNodeData(selectedNode, data)}
          onDelete={() => deleteNode(selectedNode)}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
