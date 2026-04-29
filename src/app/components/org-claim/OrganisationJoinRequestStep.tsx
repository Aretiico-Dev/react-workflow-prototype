import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface OrganisationJoinRequestStepProps {
  applicantName: string;
  onDecision: (decision: 'accepted' | 'rejected', reason?: string) => void;
}

export function OrganisationJoinRequestStep({ applicantName, onDecision }: OrganisationJoinRequestStepProps) {
  const [decision, setDecision] = useState<'accepted' | 'rejected' | null>(null);
  const [reason, setReason] = useState('');

  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-8 mt-8">
      <h2 className="text-xl font-semibold mb-4">Organisation Join Request</h2>
      <p className="mb-6">{applicantName} has requested to join your organisation.</p>
      <div className="flex gap-4 mb-6">
        <button
          className={`flex-1 rounded px-4 py-3 font-medium border transition-colors ${decision === 'accepted' ? 'bg-green-50 border-green-600 text-green-700' : 'border-gray-300 hover:bg-gray-50'}`}
          onClick={() => setDecision('accepted')}
        >
          <CheckCircle className="inline w-5 h-5 mr-2" /> Accept
        </button>
        <button
          className={`flex-1 rounded px-4 py-3 font-medium border transition-colors ${decision === 'rejected' ? 'bg-red-50 border-red-600 text-red-700' : 'border-gray-300 hover:bg-gray-50'}`}
          onClick={() => setDecision('rejected')}
        >
          <XCircle className="inline w-5 h-5 mr-2" /> Reject
        </button>
      </div>
      {decision === 'rejected' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Reason for rejection (optional, shown to applicant):</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[80px]"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Let the applicant know why their request was rejected..."
          />
        </div>
      )}
      <button
        className="w-full mt-2 rounded bg-[#101F36] text-white py-3 font-medium disabled:opacity-50"
        disabled={!decision}
        onClick={() => decision && onDecision(decision, decision === 'rejected' ? reason : undefined)}
      >
        Continue
      </button>
    </div>
  );
}
