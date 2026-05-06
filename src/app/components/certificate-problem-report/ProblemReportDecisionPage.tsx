import { useState } from 'react';
import { CheckCircle2, FileText, MessageSquare, ShieldAlert, XCircle } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { formatDateTime, mockCertificates, ProblemReport, RecommendedAction } from './data';

interface ProblemReportDecisionPageProps {
  report: ProblemReport;
  onDecision: (decision: RecommendedAction, details: string) => void;
}

export function ProblemReportDecisionPage({ report, onDecision }: ProblemReportDecisionPageProps) {
  const [ignoreDetails, setIgnoreDetails] = useState('The evidence provided does not support revocation. The report has been recorded and no certificate action will be taken.');
  const [revokeDetails, setRevokeDetails] = useState('Certificate revoked because the report and reviewer evidence show the certificate contains misleading or incorrect information.');
  const recommendation = report.reviewerRecommendation;
  const certificate = recommendation?.certificateId
    ? mockCertificates.find((item) => item.id === recommendation.certificateId)
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded border border-[#e0e0e0] bg-white p-6 shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[1.5rem] font-semibold text-[#212121]">Final decision</h2>
            <p className="mt-1 text-[0.875rem] text-[#616161]">Review the reviewer recommendation and choose the final outcome.</p>
          </div>
          <div className="w-full md:w-80">
            <CountdownTimer targetAt={report.dueAt} label="Time remaining to action" expiredLabel="24-hour target elapsed" tone="warning" />
          </div>
        </div>
      </div>

      {!recommendation ? (
        <div className="rounded border border-[#ffc107] bg-[#fff8e1] p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#c77800]" />
            <div>
              <h3 className="text-[1rem] font-semibold text-[#212121]">Waiting for reviewer recommendation</h3>
              <p className="mt-1 text-[0.875rem] text-[#212121]">The decision maker can make a final decision once the reviewer has submitted their recommendation.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded border border-[#e0e0e0] bg-white p-6">
              <h3 className="mb-4 text-[1rem] font-semibold text-[#212121]">Reviewer input</h3>
              <div className="grid gap-3">
                <InfoRow label="Recommended action" value={recommendation.action === 'revoke' ? 'Revoke certificate' : 'Ignore report'} />
                <InfoRow label="Reviewer" value={`${recommendation.submittedBy}\n${formatDateTime(recommendation.submittedAt)}`} />
                <InfoRow label="Match evidence" value={recommendation.matchEvidence || 'No match evidence provided'} />
                <InfoRow label="Recommendation explanation" value={recommendation.actionReason} />
              </div>
              {recommendation.files.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Reviewer files</p>
                  <div className="space-y-2">
                    {recommendation.files.map((file) => (
                      <div key={`${file.name}-${file.sizeLabel}`} className="flex items-center gap-2 rounded border border-[#e0e0e0] bg-[#fafafa] px-3 py-2">
                        <FileText className="h-4 w-4 text-[#616161]" />
                        <span className="text-[0.875rem] text-[#212121]">{file.name}</span>
                        <span className="text-[0.75rem] text-[#616161]">({file.sizeLabel})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded border border-[#e0e0e0] bg-white p-6">
              <h3 className="mb-4 text-[1rem] font-semibold text-[#212121]">Linked certificate</h3>
              {certificate ? (
                <div className="space-y-3">
                  <InfoRow label="Common name" value={certificate.commonName} />
                  <InfoRow label="Serial number" value={certificate.serialNumber} />
                  <InfoRow label="Organisation" value={certificate.organisation} />
                  <InfoRow label="Domains" value={certificate.domains.join(', ')} />
                </div>
              ) : (
                <p className="rounded border border-dashed border-[#e0e0e0] bg-[#fafafa] p-4 text-[0.875rem] text-[#616161]">
                  No certificate was linked. The reviewer recommended ignoring the report.
                </p>
              )}
            </section>
          </div>

          <section className="rounded border border-[#e0e0e0] bg-white p-6">
            <div className="mb-4 flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 text-[#101F36]" />
              <div>
                <h3 className="text-[1rem] font-semibold text-[#212121]">Reporter conversation</h3>
                <p className="text-[0.875rem] text-[#616161]">Public chat history visible to the reporter.</p>
              </div>
            </div>
            <div className="space-y-3">
              {report.messages.map((message) => (
                <div key={message.id} className="rounded border border-[#e0e0e0] bg-[#fafafa] p-3">
                  <div className="mb-1 flex flex-wrap justify-between gap-2">
                    <p className="text-[0.875rem] font-medium text-[#212121]">{message.author}</p>
                    <p className="text-[0.75rem] text-[#616161]">{formatDateTime(message.createdAt)}</p>
                  </div>
                  <p className="whitespace-pre-wrap text-[0.875rem] text-[#212121]">{message.body}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <DecisionCard
              title="Ignore report"
              icon="ignore"
              value={ignoreDetails}
              onChange={setIgnoreDetails}
              disabled={Boolean(report.result)}
              onConfirm={() => onDecision('ignore', ignoreDetails)}
            />
            <DecisionCard
              title="Revoke certificate"
              icon="revoke"
              value={revokeDetails}
              onChange={setRevokeDetails}
              disabled={Boolean(report.result) || !certificate}
              onConfirm={() => onDecision('revoke', revokeDetails)}
            />
          </div>
        </>
      )}
    </div>
  );
}

function DecisionCard({
  title,
  icon,
  value,
  onChange,
  disabled,
  onConfirm,
}: {
  title: string;
  icon: 'ignore' | 'revoke';
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  onConfirm: () => void;
}) {
  const Icon = icon === 'revoke' ? CheckCircle2 : XCircle;
  return (
    <div className="rounded border border-[#e0e0e0] bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon className={`h-5 w-5 ${icon === 'revoke' ? 'text-[#d32f2f]' : 'text-[#c77800]'}`} />
        <h3 className="text-[1rem] font-semibold text-[#212121]">{title}</h3>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="min-h-[120px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36] disabled:bg-[#fafafa]"
      />
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={onConfirm}
        className={`mt-4 w-full rounded px-4 py-3 text-[0.875rem] font-medium text-white disabled:opacity-50 ${
          icon === 'revoke' ? 'bg-[#d32f2f]' : 'bg-[#101F36]'
        }`}
      >
        {title}
      </button>
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
