export type ProblemReportRole = 'reporter' | 'reviewer' | 'decision-maker';
export type ReporterScenario = 'authenticated' | 'guest-email' | 'guest-no-email';
export type ProblemReportStatus = 'unprocessed' | 'under_review' | 'rejected' | 'actioned';
export type RecommendedAction = 'ignore' | 'revoke';
export type MessageVisibility = 'public' | 'private';

export interface ProblemReportDraft {
  reporterScenario: ReporterScenario;
  name: string;
  email: string;
  telephone: string;
  captchaComplete: boolean;
  certificateDetails: string;
  files: Array<{ name: string; sizeLabel: string; type: string }>;
  reason: string;
  reasonDetails: string;
}

export interface CertificateRecord {
  id: string;
  commonName: string;
  serialNumber: string;
  issuer: string;
  organisation: string;
  validFrom: string;
  validTo: string;
  domains: string[];
}

export interface ReportMessage {
  id: string;
  author: string;
  role: 'reporter' | 'admin';
  visibility: MessageVisibility;
  body: string;
  createdAt: string;
}

export interface ReviewerRecommendation {
  certificateId: string;
  action: RecommendedAction;
  matchEvidence: string;
  actionReason: string;
  files: Array<{ name: string; sizeLabel: string }>;
  submittedAt: string;
  submittedBy: string;
}

export interface ResolutionResult {
  type: 'ignored' | 'revoked';
  summary: string;
  details: string;
  certificateId?: string;
  resolvedAt: string;
  resolvedBy: string;
}

export interface ProblemReport {
  id: string;
  uuid: string;
  statusUrl: string;
  submittedAt: string;
  dueAt: string;
  hiddenAt?: string;
  reporterScenario: ReporterScenario;
  reporter: {
    authenticated: boolean;
    name?: string;
    email?: string;
    telephone?: string;
  };
  certificateDetails: string;
  files: Array<{ name: string; sizeLabel: string; type: string }>;
  reason: string;
  reasonDetails: string;
  status: ProblemReportStatus;
  messages: ReportMessage[];
  privateComments: ReportMessage[];
  reviewerRecommendation?: ReviewerRecommendation;
  result?: ResolutionResult;
}

export const authenticatedReporter = {
  name: 'Maya Okafor',
  email: 'maya.okafor@example.com',
};

export const problemReportReasons = [
  'The certificate is untrue or contains false information',
  'There is something technically incorrect with this certificate',
  'The certificate no longer meets requirements due to Certification Practice Statement (CPS) changes',
  'This certificate is being misused (e.g., against the terms and conditions)',
  'The subscriber has breached the rules of the subscriber agreement',
  'The subscriber is not permitted to issue certificates for this domain (e.g., trademark dispute, domain not renewed)',
  'A certificate is being used for a misleading subdomain',
  'A mistake was made when issuing the certificate',
  'I have found a problem with a Subscriber or Organisation',
  'Unknown',
];

export const mockCertificates: CertificateRecord[] = [
  {
    id: 'crt-10482',
    commonName: 'secure.northbridge.example',
    serialNumber: '04:91:7A:CD:22:8F:10:66',
    issuer: 'Aretiico Public TLS CA G3',
    organisation: 'Northbridge Analytics Ltd',
    validFrom: '2026-02-12',
    validTo: '2027-02-12',
    domains: ['secure.northbridge.example', 'login.northbridge.example'],
  },
  {
    id: 'crt-10516',
    commonName: 'mail.harbourview.example',
    serialNumber: '05:13:BB:8C:44:E0:21:A2',
    issuer: 'Aretiico Public TLS CA G3',
    organisation: 'Harbourview Logistics PLC',
    validFrom: '2026-03-04',
    validTo: '2027-03-04',
    domains: ['mail.harbourview.example', 'smtp.harbourview.example'],
  },
  {
    id: 'crt-10588',
    commonName: 'payments.cairnwell.example',
    serialNumber: '07:A0:11:3C:91:62:FA:48',
    issuer: 'Aretiico Public TLS CA G3',
    organisation: 'Cairnwell Retail Group',
    validFrom: '2026-04-18',
    validTo: '2027-04-18',
    domains: ['payments.cairnwell.example'],
  },
];

export function createInitialDraft(scenario: ReporterScenario): ProblemReportDraft {
  return {
    reporterScenario: scenario,
    name: scenario === 'authenticated' ? authenticatedReporter.name : '',
    email: scenario === 'authenticated' || scenario === 'guest-email' ? authenticatedReporter.email : '',
    telephone: '',
    captchaComplete: scenario === 'authenticated',
    certificateDetails:
      'The certificate appears on https://secure.northbridge.example and the organisation name does not match the service being presented.',
    files: [
      { name: 'browser-certificate-warning.png', sizeLabel: '428 KB', type: 'image/png' },
    ],
    reason: problemReportReasons[0],
    reasonDetails:
      'The subject organisation shown in the certificate looks unrelated to the site. I believe this could mislead users into trusting the wrong service.',
  };
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
