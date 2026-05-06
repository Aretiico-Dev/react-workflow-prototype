import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Lock, MessageSquare, Paperclip, Search, Send, ShieldAlert, X, XCircle } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import {
  CertificateRecord,
  formatDateTime,
  mockCertificates,
  ProblemReport,
  RecommendedAction,
  ReportMessage,
  ReviewerRecommendation,
} from './data';

interface ProblemReportReviewerPageProps {
  report: ProblemReport;
  onAddAdminMessage: (body: string) => void;
  onAddPrivateComment: (body: string) => void;
  onSubmitRecommendation: (recommendation: ReviewerRecommendation) => void;
}

export function ProblemReportReviewerPage({
  report,
  onAddAdminMessage,
  onAddPrivateComment,
  onSubmitRecommendation,
}: ProblemReportReviewerPageProps) {
  const [scenario, setScenario] = useState<'probable-match' | 'no-match'>('probable-match');
  const [selectedCertificateId, setSelectedCertificateId] = useState(mockCertificates[0].id);
  const [chatMessage, setChatMessage] = useState('');
  const [chatInternal, setChatInternal] = useState(true);
  const [matchEvidence, setMatchEvidence] = useState('The reported domain and screenshot both reference the common name and SAN entries on this certificate.');
  const [action, setAction] = useState<RecommendedAction>('revoke');
  const [actionReason, setActionReason] = useState('The certificate appears to contain information that could mislead relying parties and should be revoked.');
  const [files, setFiles] = useState<Array<{ name: string; sizeLabel: string }>>([]);

  useEffect(() => {
    setSelectedCertificateId(scenario === 'probable-match' ? mockCertificates[0].id : '');
  }, [scenario]);

  const selectedCertificate = mockCertificates.find((certificate) => certificate.id === selectedCertificateId) || null;
  const canSubmit = Boolean(actionReason.trim()) && (action === 'ignore' || Boolean(selectedCertificateId));
  const resolved = Boolean(report.result);
  const consolidatedMessages = useMemo(
    () => [...report.messages, ...report.privateComments].sort((left, right) => (
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    )),
    [report.messages, report.privateComments],
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files || []).map((file) => ({
      name: file.name,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }));
    if (nextFiles.length) setFiles((current) => [...current, ...nextFiles]);
    event.target.value = '';
  }

  function addReviewerMessage(event: FormEvent) {
    event.preventDefault();
    if (!chatMessage.trim() || resolved) return;

    if (chatInternal) {
      onAddPrivateComment(chatMessage.trim());
    } else {
      onAddAdminMessage(chatMessage.trim());
    }

    setChatMessage('');
    setChatInternal(true);
  }

  function submitRecommendation() {
    if (!canSubmit) return;
    onSubmitRecommendation({
      certificateId: selectedCertificateId,
      action,
      matchEvidence: matchEvidence.trim(),
      actionReason: actionReason.trim(),
      files,
      submittedAt: new Date().toISOString(),
      submittedBy: 'Priya Shah, Certificate Reviewer',
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded border border-[#e0e0e0] bg-white p-6 shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[1.5rem] font-semibold text-[#212121]">Certificate Problem Report Review</h2>
            <p className="mt-1 text-[0.875rem] text-[#616161]">Review submitted evidence, link a certificate, and recommend ignore or revoke.</p>
          </div>
          <div className="w-full md:w-80">
            <CountdownTimer targetAt={report.dueAt} label="Time remaining to action" expiredLabel="24-hour target elapsed" tone="warning" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SubmittedReportCard report={report} />
        <AutomatedMatchingCard scenario={scenario} onScenarioChange={setScenario} />
      </div>

      <PairCertificateCard
        selectedCertificate={selectedCertificate}
        selectedCertificateId={selectedCertificateId}
        onSelectedCertificateIdChange={setSelectedCertificateId}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ConsolidatedChatHistory
          messages={consolidatedMessages}
          value={chatMessage}
          internal={chatInternal}
          disabled={resolved}
          onValueChange={setChatMessage}
          onInternalChange={setChatInternal}
          onSubmit={addReviewerMessage}
        />

        <ReviewerRecommendationCard
          action={action}
          actionReason={actionReason}
          canSubmit={canSubmit}
          files={files}
          matchEvidence={matchEvidence}
          resolved={resolved}
          onActionChange={setAction}
          onActionReasonChange={setActionReason}
          onFileChange={handleFileChange}
          onFilesChange={setFiles}
          onMatchEvidenceChange={setMatchEvidence}
          onSubmitRecommendation={submitRecommendation}
        />
      </div>
    </div>
  );
}

function SubmittedReportCard({ report }: { report: ProblemReport }) {
  return (
    <section className="rounded border border-[#e0e0e0] bg-white p-6">
      <h3 className="mb-4 text-[1rem] font-semibold text-[#212121]">Submitted report</h3>
      <div className="grid gap-3">
        <InfoRow label="Reporter" value={reporterLabel(report)} />
        <InfoRow label="Status" value={report.status.replace('_', ' ')} />
        <InfoRow label="Reason" value={report.reason} />
        <InfoRow label="Certificate details" value={report.certificateDetails || 'No certificate details provided'} />
        <InfoRow label="Problem explanation" value={report.reasonDetails} />
      </div>
      {report.files.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Reporter attachments</p>
          <div className="space-y-2">
            {report.files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded border border-[#e0e0e0] bg-[#fafafa] px-3 py-2">
                <FileText className="h-4 w-4 text-[#616161]" />
                <span className="text-[0.875rem] text-[#212121]">{file.name}</span>
                <span className="text-[0.75rem] text-[#616161]">({file.sizeLabel})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AutomatedMatchingCard({
  scenario,
  onScenarioChange,
}: {
  scenario: 'probable-match' | 'no-match';
  onScenarioChange: (scenario: 'probable-match' | 'no-match') => void;
}) {
  return (
    <section className="rounded border border-[#e0e0e0] bg-white p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-[1rem] font-semibold text-[#212121]">Automated certificate matching</h3>
          <p className="mt-1 text-[0.75rem] text-[#616161]">Prototype toggle for match and no-match outcomes.</p>
        </div>
        <div className="flex rounded border border-[#e0e0e0] bg-[#fafafa] p-1">
          <ToggleButton active={scenario === 'probable-match'} onClick={() => onScenarioChange('probable-match')}>Probable match</ToggleButton>
          <ToggleButton active={scenario === 'no-match'} onClick={() => onScenarioChange('no-match')}>No match</ToggleButton>
        </div>
      </div>

      {scenario === 'probable-match' ? (
        <CertificateMatchCard certificate={mockCertificates[0]} />
      ) : (
        <div className="rounded border border-[#ffc107] bg-[#fff8e1] p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#c77800]" />
            <p className="text-[0.875rem] text-[#212121]">
              Automated matching did not identify a certificate with enough confidence. The reviewer can search manually, ask the reporter for more detail, or recommend ignore with an explanation if no certificate can be matched.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function PairCertificateCard({
  selectedCertificate,
  selectedCertificateId,
  onSelectedCertificateIdChange,
}: {
  selectedCertificate: CertificateRecord | null;
  selectedCertificateId: string;
  onSelectedCertificateIdChange: (certificateId: string) => void;
}) {
  return (
    <section className="rounded border border-[#e0e0e0] bg-white p-6">
      <div className="mb-4 flex items-start gap-3">
        <Search className="mt-0.5 h-5 w-5 text-[#101F36]" />
        <div>
          <h3 className="text-[1rem] font-semibold text-[#212121]">Pair report to certificate</h3>
          <p className="mt-1 text-[0.75rem] text-[#616161]">Select a certificate when the evidence supports a match.</p>
        </div>
      </div>
      <label className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Certificate</label>
      <div className="relative">
        <select
          value={selectedCertificateId}
          onChange={(event) => onSelectedCertificateIdChange(event.target.value)}
          className="w-full appearance-none rounded border border-[#e0e0e0] bg-white px-3 py-3 pr-10 text-[0.875rem] text-[#212121] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
        >
          <option value="">No certificate selected</option>
          {mockCertificates.map((certificate) => (
            <option key={certificate.id} value={certificate.id}>
              {certificate.commonName} ({certificate.serialNumber})
            </option>
          ))}
        </select>
        {selectedCertificateId && (
          <button
            type="button"
            onClick={() => onSelectedCertificateIdChange('')}
            className="absolute right-9 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#616161] hover:bg-[#f0f0f0]"
            aria-label="Clear certificate"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#616161]">⌄</span>
      </div>
      {selectedCertificate ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <InfoRow label="Common name" value={selectedCertificate.commonName} />
          <InfoRow label="Organisation" value={selectedCertificate.organisation} />
          <InfoRow label="Serial" value={selectedCertificate.serialNumber} />
        </div>
      ) : (
        <div className="mt-4 flex items-start gap-3 rounded border border-dashed border-[#e0e0e0] bg-[#fafafa] p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#616161]" />
          <p className="text-[0.875rem] text-[#616161]">No certificate has been paired. This is only valid if the recommendation is ignore and an explanation is provided.</p>
        </div>
      )}
    </section>
  );
}

function ConsolidatedChatHistory({
  messages,
  value,
  internal,
  disabled,
  onValueChange,
  onInternalChange,
  onSubmit,
}: {
  messages: ReportMessage[];
  value: string;
  internal: boolean;
  disabled: boolean;
  onValueChange: (value: string) => void;
  onInternalChange: (internal: boolean) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <section className="rounded border border-[#e0e0e0] bg-white p-6">
      <div className="mb-5 flex items-start gap-3">
        <MessageSquare className="mt-0.5 h-5 w-5 text-[#101F36]" />
        <div>
          <h3 className="text-[1rem] font-semibold text-[#212121]">Consolidated chat history</h3>
          <p className="text-[0.875rem] text-[#616161]">Internal messages are kept in the same stream and shown in a muted style.</p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <textarea
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          disabled={disabled}
          placeholder={internal ? 'Add an internal admin note...' : 'Send a public reply to the reporter...'}
          className="min-h-[104px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36] disabled:bg-[#fafafa]"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => onInternalChange(!internal)}
            disabled={disabled}
            className={`flex items-center gap-3 rounded border px-3 py-2 text-left disabled:opacity-50 ${
              internal ? 'border-[#616161] bg-[#eeeeee]' : 'border-[#90caf9] bg-[#e3f2fd]'
            }`}
          >
            <span className={`h-5 w-9 rounded-full p-0.5 transition-colors ${internal ? 'bg-[#616161]' : 'bg-[#101F36]'}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${internal ? 'translate-x-0' : 'translate-x-4'}`} />
            </span>
            <span>
              <span className="block text-[0.875rem] font-medium text-[#212121]">{internal ? 'Internal message' : 'Public reporter message'}</span>
              <span className="block text-[0.75rem] text-[#616161]">{internal ? 'Visible to admin team only' : 'Visible on the reporter status page'}</span>
            </span>
          </button>
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded bg-[#101F36] px-4 py-2 text-[0.875rem] font-medium text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Send message
          </button>
        </div>
      </form>
    </section>
  );
}

function ReviewerRecommendationCard({
  action,
  actionReason,
  canSubmit,
  files,
  matchEvidence,
  resolved,
  onActionChange,
  onActionReasonChange,
  onFileChange,
  onFilesChange,
  onMatchEvidenceChange,
  onSubmitRecommendation,
}: {
  action: RecommendedAction;
  actionReason: string;
  canSubmit: boolean;
  files: Array<{ name: string; sizeLabel: string }>;
  matchEvidence: string;
  resolved: boolean;
  onActionChange: (action: RecommendedAction) => void;
  onActionReasonChange: (value: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesChange: (files: Array<{ name: string; sizeLabel: string }>) => void;
  onMatchEvidenceChange: (value: string) => void;
  onSubmitRecommendation: () => void;
}) {
  return (
    <section className="rounded border border-[#e0e0e0] bg-white p-6">
      <h3 className="mb-4 text-[1rem] font-semibold text-[#212121]">Reviewer evidence and recommendation</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Certificate match evidence</span>
          <textarea
            value={matchEvidence}
            onChange={(event) => onMatchEvidenceChange(event.target.value)}
            className="min-h-[104px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-[#90caf9] bg-[#fafafa] px-4 py-4 text-[0.875rem] font-medium text-[#101F36] hover:bg-[#e3f2fd]">
          <Paperclip className="h-4 w-4" />
          Upload reviewer evidence
          <input type="file" multiple className="hidden" onChange={onFileChange} />
        </label>
        {files.map((file, index) => (
          <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded border border-[#e0e0e0] bg-[#fafafa] px-3 py-2">
            <span className="text-[0.875rem] text-[#212121]">{file.name} ({file.sizeLabel})</span>
            <button type="button" onClick={() => onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))} className="rounded p-1 text-[#616161] hover:bg-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div>
          <label className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Recommended action</label>
          <select
            value={action}
            onChange={(event) => onActionChange(event.target.value as RecommendedAction)}
            className="w-full rounded border border-[#e0e0e0] bg-white px-3 py-3 text-[0.875rem] text-[#212121] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
          >
            <option value="revoke">Revoke</option>
            <option value="ignore">Ignore</option>
          </select>
        </div>
        <label className="block">
          <span className="mb-2 block text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Recommendation explanation</span>
          <textarea
            value={actionReason}
            onChange={(event) => onActionReasonChange(event.target.value)}
            className="min-h-[120px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
          />
        </label>
        <button
          type="button"
          disabled={!canSubmit || resolved}
          onClick={onSubmitRecommendation}
          className="w-full rounded bg-[#101F36] px-4 py-3 text-[0.875rem] font-medium text-white disabled:opacity-50"
        >
          Submit recommendation
        </button>
      </div>
    </section>
  );
}

function CertificateMatchCard({ certificate }: { certificate: CertificateRecord }) {
  return (
    <div className="rounded border border-[#90caf9] bg-[#e3f2fd] p-5">
      <div className="mb-4 flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#101F36]" />
        <div>
          <h4 className="text-[1rem] font-semibold text-[#212121]">Probable system match found</h4>
          <p className="mt-1 text-[0.75rem] text-[#616161]">The submitted domain and screenshot match an issued certificate.</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <InfoRow label="Common name" value={certificate.commonName} />
        <InfoRow label="Serial number" value={certificate.serialNumber} />
        <InfoRow label="Organisation" value={certificate.organisation} />
        <InfoRow label="Issuer" value={certificate.issuer} />
        <InfoRow label="Validity" value={`${formatDateTime(certificate.validFrom)} to ${formatDateTime(certificate.validTo)}`} />
        <InfoRow label="Domains" value={certificate.domains.join(', ')} />
      </div>
    </div>
  );
}

function ChatMessageItem({ message }: { message: ReportMessage }) {
  const internal = message.visibility === 'private';
  return (
    <div className={`rounded border p-3 ${
      internal
        ? 'border-[#e0e0e0] bg-[#f5f5f5] text-[#616161] opacity-80'
        : message.role === 'admin'
          ? 'border-[#90caf9] bg-[#e3f2fd]'
          : 'border-[#e0e0e0] bg-white'
    }`}>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {internal && <Lock className="h-3.5 w-3.5 text-[#616161]" />}
          <p className="text-[0.875rem] font-medium text-[#212121]">{message.author}</p>
          {internal && (
            <span className="rounded bg-[#e0e0e0] px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide text-[#616161]">
              Internal
            </span>
          )}
        </div>
        <p className="text-[0.75rem] text-[#616161]">{formatDateTime(message.createdAt)}</p>
      </div>
      <p className="whitespace-pre-wrap text-[0.875rem] text-[#212121]">{message.body}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-3">
      <p className="mb-1 text-[0.75rem] text-[#616161]">{label}</p>
      <p className="whitespace-pre-wrap text-[0.875rem] font-medium text-[#212121]">{value}</p>
    </div>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-2 text-[0.75rem] font-medium ${
        active ? 'bg-[#101F36] text-white' : 'text-[#616161] hover:bg-white'
      }`}
    >
      {children}
    </button>
  );
}

function reporterLabel(report: ProblemReport) {
  const values = [report.reporter.name, report.reporter.email, report.reporter.telephone].filter(Boolean);
  return values.length ? values.join('\n') : 'No contact details provided';
}
