import React from 'react';

interface DisputeStartStepProps {
  organisationName?: string;
  onDone?: () => void;
}

export function DisputeStartStep({ organisationName, onDone }: DisputeStartStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8 text-center">
        <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
          Dispute Organisation Ownership
        </h4>
        <p className="text-[0.875rem] text-[#616161] mb-6">
          {organisationName
            ? `You are starting a dispute for ${organisationName}.`
            : 'You are starting a dispute for an organisation.'}
        </p>
        {onDone && (
          <button
            onClick={onDone}
            className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
