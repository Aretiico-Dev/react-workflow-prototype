import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

export const TriggerNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-6 py-4 rounded-full bg-green-50 border-2 min-w-[180px] ${
        selected ? 'border-green-600 shadow-lg' : 'border-green-400 shadow'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <Play className="w-5 h-5 text-green-600 fill-green-600" />
        <div className="font-medium text-green-900">{data.label}</div>
      </div>

      {data.config?.description && (
        <div className="text-xs text-green-700 mt-1 text-center">{data.config.description}</div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';
