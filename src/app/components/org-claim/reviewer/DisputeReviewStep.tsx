import { useState } from 'react';
import { ArrowRightLeft, Send } from 'lucide-react';

interface RepresentativeSummary {
  name: string;
  role: string;
  email: string;
  phone: string;
  supportedByPsc: string;
  supportEmail: string;
  claimSummary: string;
}

interface DisputeReviewStepProps {
  organisationName: string;
  activeRepresentative: RepresentativeSummary;
  claimant: RepresentativeSummary;
  initialSelection?: 'active-representative' | 'claimant' | null;
  initialReason?: string;
  onSendForReview: (selection: 'active-representative' | 'claimant', rationale: string) => void;
}

export function DisputeReviewStep({
  organisationName,
  activeRepresentative,
  claimant,
  initialSelection = null,
  initialReason = '',
  onSendForReview,
}: DisputeReviewStepProps) {
  const [selection, setSelection] = useState<'active-representative' | 'claimant' | null>(initialSelection);
  const [rationale, setRationale] = useState(initialReason);

  const isValid = !!selection && rationale.trim();

  const renderColumn = (
    title: string,
    summary: RepresentativeSummary,
    value: 'active-representative' | 'claimant',
  ) => {
    const isSelected = selection === value;

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
            onClick={() => setSelection(value)}
            className={`w-full rounded px-4 py-3 text-[0.875rem] font-medium transition-colors ${
              isSelected
                ? 'bg-[#101F36] text-white hover:bg-[#1565c0]'
                : 'border border-[#101F36] text-[#101F36] hover:bg-[#e3f2fd]'
            }`}
          >
            {isSelected ? 'Selected for Review Recommendation' : `Choose ${summary.name}`}
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
              {organisationName} already has an active representative. Compare both sides and choose which representative
              should be recommended to the admin approver.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-6xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">Dispute Review</h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Compare the active representative with the new claimant. Select the person you believe should represent the organisation and explain the evidence behind that recommendation.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            {renderColumn('Existing Active Representative', activeRepresentative, 'active-representative')}
            {renderColumn('Disputing Claimant', claimant, 'claimant')}
          </div>

          <div className="mt-6">
            <label className="block text-[0.875rem] font-medium text-[#212121] mb-2">
              Explain Your Recommendation <span className="text-[#f44336]">*</span>
            </label>
            <p className="text-[0.75rem] text-[#616161] mb-3">
              Explain why you selected this representative. Reference the evidence reviewed, any inconsistencies you found,
              and why the other side should not retain or receive representative status.
            </p>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Document the evidence and reasoning behind your dispute recommendation..."
              className="w-full min-h-[140px] resize-y rounded border border-[#e0e0e0] px-4 py-3 text-[0.875rem] focus:outline-none focus:border-[#101F36]"
            />
          </div>

          <div className="mt-6 flex justify-end border-t border-[#e0e0e0] pt-6">
            <button
              type="button"
              onClick={() => selection && onSendForReview(selection, rationale)}
              disabled={!isValid}
              className="inline-flex items-center gap-2 rounded bg-[#101F36] px-6 py-3 text-[0.875rem] font-medium text-white transition-colors hover:bg-[#1565c0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              SEND FOR REVIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
