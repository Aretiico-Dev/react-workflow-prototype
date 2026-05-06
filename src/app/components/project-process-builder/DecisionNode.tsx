import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, UserCheck } from 'lucide-react';

const iconMap: Record<string, any> = {
  approval: GitBranch,
  condition: UserCheck,
};

export const DecisionNode = memo(({ data, selected }: NodeProps) => {
  const Icon = iconMap[data.nodeType] || GitBranch;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div
        className={`w-40 h-40 bg-white border-2 ${
          selected ? 'border-blue-500 shadow-lg' : 'border-gray-300 shadow'
        } transform rotate-45 flex items-center justify-center`}
      >
        <div className="transform -rotate-45 flex flex-col items-center gap-1">
          <Icon className="w-5 h-5 text-amber-600" />
          <div className="text-sm text-center px-2">{data.label}</div>
          {data.config?.description && (
            <div className="text-xs text-gray-500 text-center px-2">{data.config.description}</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} id="yes" className="w-3 h-3" />
      <Handle type="source" position={Position.Left} id="no" className="w-3 h-3" />
    </div>
  );
});

DecisionNode.displayName = 'DecisionNode';
