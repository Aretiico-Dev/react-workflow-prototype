import { FileSignature, UserCheck, Building2, Shield, KeyRound, UserPlus, MailCheck } from 'lucide-react';

export type WorkflowType = 'certificate-purchase' | 'smime-certificate-purchase' | 'adobe-certificate-purchase' | 'user-verification' | 'organisation-claim' | 'organisation-join-request' | '2fa-reset';

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
    title: 'TLS Purchase',
    description: 'Order and verify TLS/SSL certificates for domains',
    icon: Shield,
    category: 'certificates',
  },
  {
    id: 'smime-certificate-purchase',
    title: 'S/MIME Certificate Purchase',
    description: 'Order and verify S/MIME certificates for email addresses',
    icon: MailCheck,
    category: 'certificates',
  },
  {
    id: 'adobe-certificate-purchase',
    title: 'Adobe Certificate Purchase',
    description: 'Order Adobe document signing certificates for organisations',
    icon: FileSignature,
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
  {
    id: 'organisation-join-request',
    title: 'Organisation Join Request',
    description: 'Review and approve join requests for your organisation',
    icon: UserPlus,
    category: 'organization',
  },
  {
    id: '2fa-reset',
    title: '2FA Reset',
    description: 'Reset two factor authentication for a user',
    icon: KeyRound,
    category: 'verification',
  },
];
