import { FormEvent, useState } from 'react';
import { AlertTriangle, ExternalLink, Lock, MessageSquare, Send, ShieldAlert } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { formatDateTime, ProblemReport, ReportMessage } from './data';

interface ProblemReportStatusPageProps {
  report: ProblemReport;
  forceExpired: boolean;
  onAddReporterMessage: (body: string) => void;
}

const statusLabels: Record<ProblemReport['status'], string> = {
  unprocessed: 'Unprocessed',
  under_review: 'Under review',
  rejected: 'Rejected',
  actioned: 'Actioned',
};

export function ProblemReportStatusPage({ report, forceExpired, onAddReporterMessage }: ProblemReportStatusPageProps) {
  const [message, setMessage] = useState('');
  const resolved = Boolean(report.result);
  const guest = !report.reporter.authenticated;
  const noEmail = guest && !report.reporter.email;

  if (guest && resolved && forceExpired) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded border border-[#e0e0e0] bg-white p-8 text-center shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-[#616161]" />
        <h2 className="mb-2 text-[1.5rem] font-semibold text-[#212121]">404 - report status no longer available</h2>
        <p className="text-[0.875rem] text-[#616161]">
          This unauthenticated report result was hidden 48 hours after resolution.
        </p>
      </div>
    );
  }

  function submitMessage(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || resolved) return;
    onAddReporterMessage(message.trim());
    setMessage('');
  }

  return (
    <div className="space-y-6">
      <div className="rounded border border-[#e0e0e0] bg-white p-6 shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Problem report {report.id}</p>
            <h2 className="mt-1 text-[1.5rem] font-semibold text-[#212121]">Status: {statusLabels[report.status]}</h2>
            <p className="mt-1 text-[0.875rem] text-[#616161]">Submitted {formatDateTime(report.submittedAt)}</p>
          </div>
          <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-3">
            <div className="flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">
              <ExternalLink className="h-4 w-4" />
              Private status URL
            </div>
            <p className="mt-1 break-all text-[0.875rem] font-medium text-[#101F36]">{report.statusUrl}</p>
          </div>
        </div>
      </div>

      {noEmail && (
        <div className="rounded border-l-4 border-[#ffc107] bg-[#fff8e1] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#c77800]" />
            <div>
              <p className="text-[0.875rem] font-medium text-[#212121]">Save this status URL</p>
              <p className="mt-1 text-[0.875rem] text-[#212121]">
                No email address was provided, so we cannot send reminders or recover this link if it is lost.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          {!resolved && (
            <CountdownTimer
              targetAt={report.dueAt}
              label="Time remaining to action report"
              expiredLabel="24-hour action target elapsed"
              tone="warning"
            />
          )}
          {guest && resolved && report.hiddenAt && (
            <CountdownTimer
              targetAt={report.hiddenAt}
              label="Result visible for"
              expiredLabel="Result visibility elapsed"
              tone="warning"
            />
          )}
          <div className="rounded border border-[#e0e0e0] bg-white p-4">
            <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Report reason</p>
            <p className="text-[0.875rem] font-medium text-[#212121]">{report.reason}</p>
            <p className="mt-3 whitespace-pre-wrap text-[0.875rem] text-[#616161]">{report.reasonDetails}</p>
          </div>
          {report.result && (
            <div className={`rounded border p-4 ${
              report.result.type === 'revoked'
                ? 'border-[#ef9a9a] bg-[#ffebee]'
                : 'border-[#ffc107] bg-[#fff8e1]'
            }`}>
              <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wide text-[#616161]">Resolution</p>
              <p className="text-[1rem] font-semibold text-[#212121]">{report.result.summary}</p>
              <p className="mt-2 whitespace-pre-wrap text-[0.875rem] text-[#212121]">{report.result.details}</p>
              <p className="mt-3 text-[0.75rem] text-[#616161]">
                Resolved {formatDateTime(report.result.resolvedAt)} by {report.result.resolvedBy}
              </p>
            </div>
          )}
        </div>

        <div className="rounded border border-[#e0e0e0] bg-white p-6 shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
          <div className="mb-5 flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 text-[#101F36]" />
            <div>
              <h3 className="text-[1.125rem] font-semibold text-[#212121]">Messages</h3>
              <p className="text-[0.875rem] text-[#616161]">Public conversation between the reporter and admin team.</p>
            </div>
          </div>

          <div className="space-y-3">
            {report.messages.map((item) => (
              <MessageBubble key={item.id} message={item} />
            ))}
          </div>

          {resolved ? (
            <div className="mt-5 flex items-center gap-2 rounded border border-[#e0e0e0] bg-[#fafafa] p-3 text-[0.875rem] text-[#616161]">
              <Lock className="h-4 w-4" />
              This conversation is read-only because the report has been resolved.
            </div>
          ) : (
            <form onSubmit={submitMessage} className="mt-5 space-y-3">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Reply to the admin team..."
                className="min-h-[104px] w-full resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] focus:border-[#101F36] focus:outline-none focus:ring-1 focus:ring-[#101F36]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded bg-[#101F36] px-4 py-2 text-[0.875rem] font-medium text-white hover:bg-[#0b1728]"
              >
                <Send className="h-4 w-4" />
                Send reply
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ReportMessage }) {
  const admin = message.role === 'admin';
  return (
    <div className={`rounded border p-4 ${admin ? 'border-[#90caf9] bg-[#e3f2fd]' : 'border-[#e0e0e0] bg-[#fafafa]'}`}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.875rem] font-medium text-[#212121]">{message.author}</p>
        <p className="text-[0.75rem] text-[#616161]">{formatDateTime(message.createdAt)}</p>
      </div>
      <p className="whitespace-pre-wrap text-[0.875rem] text-[#212121]">{message.body}</p>
    </div>
  );
}
