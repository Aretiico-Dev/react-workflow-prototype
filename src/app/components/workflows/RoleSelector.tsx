export type UserRole = 'customer' | 'reviewer' | 'approver';

export interface RoleOption {
  id: string;
  label: string;
  description: string;
  accentColor: string;
  backgroundColor: string;
}

export const roles: RoleOption[] = [
  {
    id: 'customer',
    label: 'Customer',
    description: 'User submitting verification',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'reviewer',
    label: 'Document Reviewer',
    description: 'First-level verification review',
    accentColor: '#ffc107',
    backgroundColor: '#fff8e1',
  },
  {
    id: 'approver',
    label: 'Admin Approver',
    description: 'Final approval authority',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

interface RoleSelectorProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  roles?: RoleOption[];
}

export function RoleSelector({ currentRole, onRoleChange, roles: roleOptions = roles }: RoleSelectorProps) {
  const current = roleOptions.find(r => r.id === currentRole);

  return (
    <div className="relative">
      <select
        value={currentRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="appearance-none px-4 py-2 pr-8 border border-[#e0e0e0] rounded bg-white text-[0.875rem] font-medium text-[#212121] hover:border-[#90caf9] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36] cursor-pointer"
        style={current ? { borderLeftWidth: '4px', borderLeftColor: current.accentColor } : {}}
      >
        {roleOptions.map((role) => (
          <option key={role.id} value={role.id}>
            {role.label}
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

export function getRoleConfig(role: string, roleOptions: RoleOption[] = roles): RoleOption {
  return roleOptions.find(r => r.id === role) || roleOptions[0];
}
