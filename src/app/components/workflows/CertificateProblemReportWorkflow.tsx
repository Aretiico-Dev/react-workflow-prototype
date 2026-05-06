import { useState } from 'react';
import { AlertTriangle, Bug, FileSearch, Gavel, MessageSquare } from 'lucide-react';
import { RoleOption, RoleSelector, getRoleConfig } from './RoleSelector';
import { ReporterWizard } from '../certificate-problem-report/ReporterWizard';
import { ProblemReportStatusPage } from '../certificate-problem-report/ProblemReportStatusPage';
import { ProblemReportReviewerPage } from '../certificate-problem-report/ProblemReportReviewerPage';
import { ProblemReportDecisionPage } from '../certificate-problem-report/ProblemReportDecisionPage';
import {
  authenticatedReporter,
  createInitialDraft,
  mockCertificates,
  ProblemReport,
  ProblemReportDraft,
  ProblemReportRole,
  ProblemReportStatus,
  RecommendedAction,
  ReporterScenario,
  ReviewerRecommendation,
} from '../certificate-problem-report/data';

const problemReportRoles: RoleOption[] = [
  {
    id: 'reporter',
    label: 'Reporter',
    description: 'Person submitting and tracking a certificate problem report',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'reviewer',
    label: 'Reviewer',
    description: 'Administrator linking evidence to a certificate and recommending action',
    accentColor: '#ffc107',
    backgroundColor: '#fff8e1',
  },
  {
    id: 'decision-maker',
    label: 'Decision Maker',
    description: 'Final approver deciding whether to revoke or ignore',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

export function CertificateProblemReportWorkflow() {
  const [role, setRole] = useState<ProblemReportRole>('reporter');
  const [draft, setDraft] = useState<ProblemReportDraft>(() => createInitialDraft('authenticated'));
  const [currentStep, setCurrentStep] = useState(0);
  const [report, setReport] = useState<ProblemReport | null>(null);
  const [forceExpired, setForceExpired] = useState(false);
  const roleConfig = getRoleConfig(role, problemReportRoles);

  function submitReport() {
    const nextReport = createReportFromDraft(draft);
    setReport(nextReport);
    setForceExpired(false);
  }

  function loadSample(scenario: ReporterScenario = draft.reporterScenario) {
    const sampleDraft = createInitialDraft(scenario);
    setDraft(sampleDraft);
    setReport(createReportFromDraft(sampleDraft));
    setCurrentStep(0);
    setForceExpired(false);
  }

  function addReporterMessage(body: string) {
    setReport((current) => current && {
      ...current,
      messages: [
        ...current.messages,
        {
          id: `msg-${Date.now()}`,
          author: current.reporter.name || current.reporter.email || 'Unauthenticated reporter',
          role: 'reporter',
          visibility: 'public',
          body,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  function addAdminMessage(body: string) {
    setReport((current) => current && {
      ...current,
      status: current.status === 'unprocessed' ? 'under_review' : current.status,
      messages: [
        ...current.messages,
        {
          id: `msg-${Date.now()}`,
          author: 'Certificate Operations',
          role: 'admin',
          visibility: 'public',
          body,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  function addPrivateComment(body: string) {
    setReport((current) => current && {
      ...current,
      privateComments: [
        ...current.privateComments,
        {
          id: `private-${Date.now()}`,
          author: 'Priya Shah, Certificate Reviewer',
          role: 'admin',
          visibility: 'private',
          body,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  function submitRecommendation(recommendation: ReviewerRecommendation) {
    setReport((current) => current && {
      ...current,
      status: 'under_review',
      reviewerRecommendation: recommendation,
      privateComments: [
        ...current.privateComments,
        {
          id: `private-${Date.now()}`,
          author: recommendation.submittedBy,
          role: 'admin',
          visibility: 'private',
          body: `Recommended action: ${recommendation.action}`,
          createdAt: recommendation.submittedAt,
        },
      ],
    });
  }

  function makeDecision(decision: RecommendedAction, details: string) {
    setReport((current) => {
      if (!current) return current;
      const resolvedAt = new Date().toISOString();
      const linkedCertificate = current.reviewerRecommendation?.certificateId
        ? mockCertificates.find((certificate) => certificate.id === current.reviewerRecommendation?.certificateId)
        : null;

      return {
        ...current,
        status: decision === 'revoke' ? 'actioned' : 'rejected',
        hiddenAt: new Date(new Date(resolvedAt).getTime() + 48 * 60 * 60 * 1000).toISOString(),
        result: {
          type: decision === 'revoke' ? 'revoked' : 'ignored',
          summary: decision === 'revoke' ? 'Certificate revoked' : 'Report ignored',
          details: decision === 'revoke' && linkedCertificate
            ? `${details}\n\nRevoked certificate: ${linkedCertificate.commonName}\nSerial: ${linkedCertificate.serialNumber}\nReason: ${current.reason}`
            : details,
          certificateId: linkedCertificate?.id,
          resolvedAt,
          resolvedBy: 'Martin Hughes, Decision Maker',
        },
        messages: [
          ...current.messages,
          {
            id: `msg-${Date.now()}`,
            author: 'Certificate Operations',
            role: 'admin',
            visibility: 'public',
            body: decision === 'revoke'
              ? 'The report has been actioned and the linked certificate has been revoked.'
              : 'The report has been reviewed and no certificate action will be taken.',
            createdAt: resolvedAt,
          },
        ],
      };
    });
    setForceExpired(false);
    setRole('reporter');
  }

  function applyStatusScenario(status: ProblemReportStatus) {
    const base = report || createReportFromDraft(draft);
    const now = new Date().toISOString();
    const linkedCertificate = mockCertificates[0];
    const resolved = status === 'rejected' || status === 'actioned';

    setReport({
      ...base,
      status,
      hiddenAt: resolved ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() : undefined,
      result: status === 'rejected'
        ? {
            type: 'ignored',
            summary: 'Report ignored',
            details: 'The information provided was reviewed, but no certificate could be matched with enough confidence to take action.',
            resolvedAt: now,
            resolvedBy: 'Martin Hughes, Decision Maker',
          }
        : status === 'actioned'
          ? {
              type: 'revoked',
              summary: 'Certificate revoked',
              details: `Certificate ${linkedCertificate.commonName} was revoked because the reported problem was confirmed.\nSerial: ${linkedCertificate.serialNumber}`,
              certificateId: linkedCertificate.id,
              resolvedAt: now,
              resolvedBy: 'Martin Hughes, Decision Maker',
            }
          : undefined,
    });
    setForceExpired(false);
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded border-l-4 p-4"
        style={{
          backgroundColor: roleConfig.backgroundColor,
          borderLeftColor: roleConfig.accentColor,
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-[1rem] font-semibold text-[#212121]">Viewing as: {roleConfig.label}</h3>
            <p className="mt-0.5 text-[0.75rem] text-[#616161]">{roleConfig.description}</p>
          </div>
          <RoleSelector
            currentRole={role}
            onRoleChange={(nextRole) => setRole(nextRole as ProblemReportRole)}
            roles={problemReportRoles}
          />
        </div>
      </div>

      <div className="rounded border border-[#e0e0e0] bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Bug className="mt-0.5 h-5 w-5 text-[#101F36]" />
            <div>
              <p className="text-[0.875rem] font-medium text-[#212121]">Prototype scenarios</p>
              <p className="text-[0.75rem] text-[#616161]">Jump between report states and reporter variations without a backend.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => loadSample('authenticated')} className="rounded border border-[#e0e0e0] px-3 py-2 text-[0.75rem] font-medium text-[#212121] hover:border-[#90caf9]">
              Auth sample
            </button>
            <button type="button" onClick={() => loadSample('guest-email')} className="rounded border border-[#e0e0e0] px-3 py-2 text-[0.75rem] font-medium text-[#212121] hover:border-[#90caf9]">
              Guest with email
            </button>
            <button type="button" onClick={() => loadSample('guest-no-email')} className="rounded border border-[#e0e0e0] px-3 py-2 text-[0.75rem] font-medium text-[#212121] hover:border-[#90caf9]">
              Guest no email
            </button>
            {(['unprocessed', 'under_review', 'rejected', 'actioned'] as ProblemReportStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => applyStatusScenario(status)}
                className={`rounded border px-3 py-2 text-[0.75rem] font-medium ${
                  report?.status === status
                    ? 'border-[#101F36] bg-[#101F36] text-white'
                    : 'border-[#e0e0e0] text-[#212121] hover:border-[#90caf9]'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setForceExpired(true)}
              disabled={!report?.result || report.reporter.authenticated}
              className="rounded border border-[#ffc107] px-3 py-2 text-[0.75rem] font-medium text-[#c77800] hover:bg-[#fff8e1] disabled:opacity-50"
            >
              Expired 404
            </button>
          </div>
        </div>
      </div>

      {role === 'reporter' && !report && (
        <ReporterWizard
          draft={draft}
          currentStep={currentStep}
          onDraftChange={setDraft}
          onStepChange={setCurrentStep}
          onSubmit={submitReport}
        />
      )}

      {role === 'reporter' && report && (
        <div className="space-y-4">
          <ProblemReportStatusPage report={report} forceExpired={forceExpired} onAddReporterMessage={addReporterMessage} />
          <button
            type="button"
            onClick={() => {
              setReport(null);
              setForceExpired(false);
              setCurrentStep(0);
            }}
            className="rounded border border-[#e0e0e0] bg-white px-4 py-2 text-[0.875rem] font-medium text-[#212121] hover:border-[#90caf9]"
          >
            Start another report
          </button>
        </div>
      )}

      {role === 'reviewer' && (
        report ? (
          <ProblemReportReviewerPage
            report={report}
            onAddAdminMessage={addAdminMessage}
            onAddPrivateComment={addPrivateComment}
            onSubmitRecommendation={submitRecommendation}
          />
        ) : (
          <EmptyAdminState title="No report submitted yet" body="Load a sample report or submit the reporter wizard before reviewing." onLoadSample={() => loadSample()} icon="review" />
        )
      )}

      {role === 'decision-maker' && (
        report ? (
          <ProblemReportDecisionPage report={report} onDecision={makeDecision} />
        ) : (
          <EmptyAdminState title="No report submitted yet" body="Load a sample report before making a final decision." onLoadSample={() => loadSample()} icon="decision" />
        )
      )}
    </div>
  );
}

function createReportFromDraft(draft: ProblemReportDraft): ProblemReport {
  const submittedAt = new Date();
  const uuid = createUuid();
  const authenticated = draft.reporterScenario === 'authenticated';
  const hasAnyContact = Boolean(draft.name || draft.email || draft.telephone);

  return {
    id: `CPR-${submittedAt.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    uuid,
    statusUrl: `https://portal.aretiico.test/problem-reports/status/${uuid}`,
    submittedAt: submittedAt.toISOString(),
    dueAt: new Date(submittedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    reporterScenario: draft.reporterScenario,
    reporter: {
      authenticated,
      name: authenticated ? authenticatedReporter.name : draft.name || undefined,
      email: authenticated ? authenticatedReporter.email : draft.email || undefined,
      telephone: draft.telephone || undefined,
    },
    certificateDetails: draft.certificateDetails,
    files: draft.files,
    reason: draft.reason,
    reasonDetails: draft.reasonDetails,
    status: 'unprocessed',
    privateComments: [],
    messages: [
      {
        id: 'msg-submitted',
        author: hasAnyContact || authenticated
          ? (authenticated ? authenticatedReporter.name : draft.name || draft.email || 'Unauthenticated reporter')
          : 'Unauthenticated reporter',
        role: 'reporter',
        visibility: 'public',
        body: 'Problem report submitted.',
        createdAt: submittedAt.toISOString(),
      },
    ],
  };
}

function createUuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function EmptyAdminState({
  title,
  body,
  onLoadSample,
  icon,
}: {
  title: string;
  body: string;
  onLoadSample: () => void;
  icon: 'review' | 'decision';
}) {
  const Icon = icon === 'review' ? FileSearch : Gavel;
  return (
    <div className="mx-auto max-w-2xl rounded border border-[#e0e0e0] bg-white p-8 text-center shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
      <Icon className="mx-auto mb-4 h-10 w-10 text-[#101F36]" />
      <h2 className="mb-2 text-[1.25rem] font-semibold text-[#212121]">{title}</h2>
      <p className="mb-5 text-[0.875rem] text-[#616161]">{body}</p>
      <button
        type="button"
        onClick={onLoadSample}
        className="inline-flex items-center gap-2 rounded bg-[#101F36] px-4 py-2 text-[0.875rem] font-medium text-white"
      >
        <MessageSquare className="h-4 w-4" />
        Load sample report
      </button>
    </div>
  );
}
