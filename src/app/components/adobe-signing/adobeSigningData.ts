export type AdobeOrganizationStatus = 'validated' | 'expired' | 'suspended';
export type AdobeUserStatus = 'validated' | 'expired' | 'suspended' | 'not-validated';

export interface AdobeOrganization {
  id: string;
  name: string;
  status: AdobeOrganizationStatus;
  validatedUntil?: string;
  approverName: string;
}

export interface AdobeOrganizationUser {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  status: AdobeUserStatus;
  validatedUntil?: string;
}

export const adobeOrganizations: AdobeOrganization[] = [
  {
    id: 'org-1',
    name: 'Acme Corporation',
    status: 'validated',
    validatedUntil: '2027-03-20',
    approverName: 'Anne Apple',
  },
  {
    id: 'org-2',
    name: 'Global Trading Corp',
    status: 'expired',
    validatedUntil: '2025-12-15',
    approverName: 'Priya Patel',
  },
  {
    id: 'org-3',
    name: 'Suspended Industries Ltd',
    status: 'suspended',
    approverName: 'Marcus Chen',
  },
];

export const adobeOrganizationUsers: AdobeOrganizationUser[] = [
  {
    id: 'user-1',
    organizationId: 'org-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@acme.example',
    role: 'Finance Director',
    status: 'validated',
    validatedUntil: '2027-02-14',
  },
  {
    id: 'user-2',
    organizationId: 'org-1',
    name: 'Sam Patel',
    email: 'sam.patel@acme.example',
    role: 'Legal Operations Manager',
    status: 'validated',
    validatedUntil: '2027-01-08',
  },
  {
    id: 'user-3',
    organizationId: 'org-1',
    name: 'Jordan Lee',
    email: 'jordan.lee@acme.example',
    role: 'Procurement Lead',
    status: 'expired',
    validatedUntil: '2025-11-03',
  },
  {
    id: 'user-4',
    organizationId: 'org-1',
    name: 'Taylor Smith',
    email: 'taylor.smith@acme.example',
    role: 'Operations Analyst',
    status: 'not-validated',
  },
  {
    id: 'user-5',
    organizationId: 'org-1',
    name: 'Casey Nguyen',
    email: 'casey.nguyen@acme.example',
    role: 'Contract Manager',
    status: 'suspended',
  },
  {
    id: 'user-6',
    organizationId: 'org-2',
    name: 'Nadia Brown',
    email: 'nadia.brown@globaltrading.example',
    role: 'Company Secretary',
    status: 'validated',
    validatedUntil: '2026-09-19',
  },
];

export const organizationStatusConfig = {
  validated: {
    label: 'Validated',
    color: 'bg-[#b9f6ca] text-[#00c853] border-[#00c853]',
    reason: 'Eligible for Adobe certificate orders',
  },
  expired: {
    label: 'Expired',
    color: 'bg-[#f9d8d8] text-[#f44336] border-[#f44336]',
    reason: 'Organisation validation has expired',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-[#fff8e1] text-[#ffc107] border-[#ffc107]',
    reason: 'Organisation access is suspended',
  },
};

export const userStatusConfig = {
  validated: {
    label: 'Validated',
    color: 'bg-[#b9f6ca] text-[#00c853] border-[#00c853]',
    reason: 'Eligible for individual attestation',
  },
  expired: {
    label: 'Expired',
    color: 'bg-[#f9d8d8] text-[#f44336] border-[#f44336]',
    reason: 'User validation has expired',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-[#fff8e1] text-[#ffc107] border-[#ffc107]',
    reason: 'User access is suspended',
  },
  'not-validated': {
    label: 'Not Validated',
    color: 'bg-[#e0e0e0] text-[#616161] border-[#787878]',
    reason: 'User has not completed validation',
  },
};
