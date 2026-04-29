import { useState } from 'react';
import { ArrowRightLeft, CheckCircle, XCircle } from 'lucide-react';

interface RepresentativeSummary {
  name: string;
  role: string;
  email: string;
  phone: string;
  supportedByPsc: string;
  supportEmail: string;
  claimSummary: string;
}

interface DisputeFinalApprovalStepProps {
  disputeData: {
    organisationName: string;
    activeRepresentative: RepresentativeSummary;
    claimant: RepresentativeSummary;
    reviewerRecommendation: {
      selectedRepresentative: 'active-representative' | 'claimant';
      rationale: string;
    };
  };
  onDecision: (
    decision: 'approved' | 'rejected',
    representativeName: string,
    reason?: string,
  ) => void;
}

export function DisputeFinalApprovalStep({ disputeData, onDecision }: DisputeFinalApprovalStepProps) {
  const [selection, setSelection] = useState<{
    side: 'active-representative' | 'claimant';
  } | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [decisionNotes, setDecisionNotes] = useState('');

  const representativeFor = (side: 'active-representative' | 'claimant') =>
    side === 'active-representative' ? disputeData.activeRepresentative : disputeData.claimant;

  const renderColumn = (
    title: string,
    summary: RepresentativeSummary,
    side: 'active-representative' | 'claimant',
  ) => {
    const isSelected = selection?.side === side;

    return (
      <div className={`rounded-lg border p-6 ${isSelected ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] bg-[#fafafa]'}`}>
        <div className="mb-4">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#616161]">{title}</p>
          <p className="mt-2 text-[1rem] font-semibold text-[#212121]">{summary.name}</p>
          <p className="text-[0.875rem] text-[#616161]">{summary.role}</p>
        </div>

        <div className="space-y-3 text-[0.875rem] text-[#212121]">
          <div>
            <p className="text-[0.75rem] font-medium text-[#616161]">Email</p>
            <p>{summary.email}</p>
          </div>
          <div>
            <p className="text-[0.75rem] font-medium text-[#616161]">Phone</p>
            <p>{summary.phone}</p>
          </div>
          <div>
            <p className="text-[0.75rem] font-medium text-[#616161]">PSC Support</p>
            <p>{summary.supportedByPsc}</p>
            <p className="text-[0.75rem] text-[#616161]">{summary.supportEmail}</p>
          </div>
          <div>
            <p className="text-[0.75rem] font-medium text-[#616161]">Claim Context</p>
            <p>{summary.claimSummary}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#e0e0e0] pt-4">
          <button
            type="button"
            onClick={() => setSelection({ side })}
            className={`w-full rounded px-4 py-3 text-[0.875rem] font-medium transition-colors ${
              isSelected
                ? 'bg-[#101F36] text-white hover:bg-[#1565c0]'
                : 'border border-[#101F36] text-[#101F36] hover:bg-[#e3f2fd]'
            }`}
          >
            {isSelected ? 'Selected for Final Decision' : `Choose ${summary.name}`}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fff8e1] border-l-4 border-[#ffc107] rounded p-4">
        <div className="flex items-start gap-3">
          <ArrowRightLeft className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.875rem] font-medium text-[#212121]">Disputed Organisation Claim</p>
            <p className="text-[0.75rem] text-[#616161] mt-1">
              This claim is a dispute between the current active representative and a new claimant. Review both sides and the reviewer recommendation before making the final decision.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-6xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">Final Dispute Approval</h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Compare both representatives for {disputeData.organisationName}. You may approve or reject either side and optionally record additional decision notes.
          </p>

          <div className="rounded-lg border border-[#90caf9] bg-[#e3f2fd] p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-1">Reviewer Recommendation</p>
            <p className="text-[0.875rem] text-[#212121]">
              Recommended representative:{' '}
              <strong>
                {representativeFor(disputeData.reviewerRecommendation.selectedRepresentative).name}
              </strong>
            </p>
            <p className="text-[0.75rem] text-[#616161] mt-2 whitespace-pre-wrap">
              {disputeData.reviewerRecommendation.rationale}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {renderColumn('Existing Active Representative', disputeData.activeRepresentative, 'active-representative')}
            {renderColumn('Disputing Claimant', disputeData.claimant, 'claimant')}
          </div>

          {/* Final Outcome section removed as per requirements */}
          <div>
            <label className="block text-[0.875rem] font-medium text-[#212121] mb-2">
              Admin Decision Notes
            </label>
            <p className="text-[0.75rem] text-[#616161] mb-3">
              Optionally explain why you approved or rejected this representative and record any final considerations for the audit trail.
            </p>
            <textarea
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="Optional notes about the final dispute decision..."
              className="w-full min-h-[120px] resize-y rounded border border-[#e0e0e0] px-4 py-3 text-[0.875rem] focus:outline-none focus:border-[#101F36]"
            />
            <div className="mt-6 flex justify-end border-t border-[#e0e0e0] pt-6">
              <button
                type="button"
                onClick={() => selection && onDecision(decision, representativeFor(selection.side).name, decisionNotes || undefined)}
                disabled={!selection}
                className="inline-flex items-center gap-2 rounded bg-[#101F36] px-6 py-3 text-[0.875rem] font-medium text-white transition-colors hover:bg-[#1565c0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {decision === 'rejected' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                CONFIRM DECISION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
