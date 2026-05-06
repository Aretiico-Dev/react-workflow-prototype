import { Mail, MessageSquare, Slack, Cog, CheckCircle, ClipboardList, Globe, Users, UserCheck, Upload, GitBranch, Square, Play } from 'lucide-react';

const nodeCategories = [
  {
    title: 'Start',
    nodes: [
      { type: 'trigger', nodeType: 'trigger', label: 'Trigger', icon: Play },
    ],
  },
  {
    title: 'Communication',
    nodes: [
      { type: 'process', nodeType: 'email', label: 'Email', icon: Mail },
      { type: 'process', nodeType: 'sms', label: 'SMS', icon: MessageSquare },
      { type: 'process', nodeType: 'slack', label: 'Slack Message', icon: Slack },
    ],
  },
  {
    title: 'Actions',
    nodes: [
      { type: 'process', nodeType: 'automation', label: 'Automation Batch', icon: Cog },
      { type: 'process', nodeType: 'manual', label: 'Manual Task', icon: ClipboardList },
      { type: 'process', nodeType: 'upload', label: 'File Upload', icon: Upload },
    ],
  },
  {
    title: 'Meetings',
    nodes: [
      { type: 'process', nodeType: 'online-meeting', label: 'Online Meeting', icon: Globe },
      { type: 'process', nodeType: 'offline-meeting', label: 'Offline Meeting', icon: Users },
    ],
  },
  {
    title: 'Forms & Approvals',
    nodes: [
      { type: 'process', nodeType: 'webform', label: 'Web Form', icon: CheckCircle },
      { type: 'decision', nodeType: 'approval', label: 'Approval/Rejection', icon: GitBranch },
      { type: 'decision', nodeType: 'condition', label: 'Condition', icon: UserCheck },
    ],
  },
  {
    title: 'Custom',
    nodes: [
      { type: 'process', nodeType: 'blank', label: 'Blank Node', icon: Square },
    ],
  },
];

export function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, type: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.setData('label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto p-4">
      <h2 className="mb-4">Process Nodes</h2>

      {nodeCategories.map((category) => (
        <div key={category.title} className="mb-6">
          <h3 className="text-sm text-gray-500 mb-2">{category.title}</h3>
          <div className="space-y-2">
            {category.nodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.nodeType}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 border border-gray-200"
                  draggable
                  onDragStart={(e) => onDragStart(e, node.nodeType, node.type, node.label)}
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
