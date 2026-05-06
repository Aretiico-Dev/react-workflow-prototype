import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mail, MessageSquare, Slack, Cog, ClipboardList, Globe, Users, Upload, CheckCircle, Square } from 'lucide-react';

const iconMap: Record<string, any> = {
  email: Mail,
  sms: MessageSquare,
  slack: Slack,
  automation: Cog,
  manual: ClipboardList,
  'online-meeting': Globe,
  'offline-meeting': Users,
  upload: Upload,
  webform: CheckCircle,
  blank: Square,
};

export const ProcessNode = memo(({ data, selected }: NodeProps) => {
  const Icon = iconMap[data.nodeType] || Square;

  return (
    <div
      className={`px-4 py-3 rounded-lg bg-white border-2 min-w-[160px] ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300 shadow'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        <div className="text-sm">{data.label}</div>
      </div>

      {data.config?.description && (
        <div className="text-xs text-gray-500 mt-1">{data.config.description}</div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';
