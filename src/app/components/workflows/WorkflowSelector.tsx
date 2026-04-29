import { FileText, UserCheck, Building2, Shield } from 'lucide-react';

export type WorkflowType = 'certificate-purchase' | 'user-verification' | 'organisation-claim';

interface WorkflowOption {
  id: WorkflowType;
  title: string;
  description: string;
  icon: typeof Shield;
  category: 'certificates' | 'verification' | 'organization';
}

export const workflows: WorkflowOption[] = [
  {
    id: 'certificate-purchase',
    title: 'Certificate Purchase',
    description: 'Order and verify TLS/SSL certificates for domains',
    icon: Shield,
    category: 'certificates',
  },
  {
    id: 'user-verification',
    title: 'User Verification',
    description: 'Verify user identity and credentials',
    icon: UserCheck,
    category: 'verification',
  },
  {
    id: 'organisation-claim',
    title: 'Organisation Claim',
    description: 'Claim organisation representative status',
    icon: Building2,
    category: 'organization',
  },
];

interface WorkflowSelectorProps {
  currentWorkflow: WorkflowType;
  onWorkflowChange: (workflow: WorkflowType) => void;
}

export function WorkflowSelector({ currentWorkflow, onWorkflowChange }: WorkflowSelectorProps) {
  const current = workflows.find(w => w.id === currentWorkflow);

  return (
    <div className="relative">
      <select
        value={currentWorkflow}
        onChange={(e) => onWorkflowChange(e.target.value as WorkflowType)}
        className="appearance-none px-4 py-2 pr-8 border border-[#e0e0e0] rounded bg-white text-[0.875rem] font-medium text-[#212121] hover:border-[#90caf9] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36] cursor-pointer"
      >
        {workflows.map((workflow) => (
          <option key={workflow.id} value={workflow.id}>
            {workflow.title}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-[#616161]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
